const express = require('express')
const router = express.Router()
const uriHelpers = require('../helpers/uri.helpers')
const stringHelpers = require('../helpers/string.helpers')
const { logger } = require('../helpers/logger.helpers')
const axios = require('axios')
const metricHelpers = require('../helpers/metric.helpers')
const secretHelpers = require('../helpers/secret.helpers')

router.get('/:endpointName/:key', async (req, res, next) => {
  try {
    const endpointName = req.params.endpointName
    const projectKey = req.params.key

    logger.debug(endpointName)
    logger.debug(projectKey)

    // get endpoint
    const endpoint = await secretHelpers.getEndpoint(endpointName)
    logger.debug(endpoint)

    if (!endpoint) {
      return res.status(404).send({ message: 'Endpoint not found' })
    }

    const token = endpoint.data.find((x) => x.key === 'token')

    let response = null

    switch (endpoint?.metadata.type) {
      case 'sonarcloud':
        const headers = {
          Authorization: `Basic ${stringHelpers.to64(token.val + ':')}`
        }

        const metrics = [
          { name: 'alert_status', category: 'alerts' },
          { name: 'bugs', category: 'alerts' },
          { name: 'reliability_rating', category: 'alerts' },
          { name: 'vulnerabilities', category: 'alerts' },
          { name: 'security_rating', category: 'alerts' },
          { name: 'code_smells', category: 'alerts' },
          { name: 'coverage', category: 'alerts' },
          { name: 'comment_lines', category: 'stats' },
          { name: 'directories', category: 'stats' },
          { name: 'duplicated_files', category: 'stats' },
          { name: 'files', category: 'stats' },
          { name: 'lines', category: 'stats' }
        ]

        const apis = [
          {
            url: `components/show?component=${projectKey}`,
            key: 'component',
            prop: 'component'
          },
          {
            url: `measures/component?component=${projectKey}&metricKeys=${metrics
              .map((x) => x.name)
              .join(',')}`,
            key: 'metrics',
            prop: 'component'
          }
        ]
        const content = await Promise.all(
          apis.map(async (v) => {
            const call = await axios.get(
              uriHelpers.concatUrl([endpoint.target, v.url]),
              {
                headers
              }
            )
            return {
              [v.key]: v.prop ? call.data[v.prop] : call.data
            }
          })
        )

        response = Object.assign({}, ...content)
        response.metrics = response.metrics.measures.map((v) => {
          return {
            metric: v.metric,
            label: v.metric.replace(/[_]/gm, ' '),
            value: metricHelpers.value(v.metric, v.value),
            color: metricHelpers.color(v.metric, v.value),
            icon: metricHelpers.icon(v.metric),
            category: metrics.find((x) => x.name === v.metric).category
          }
        })

        const parsed = uriHelpers.parse(endpoint.target)
        response.link = `${parsed.schema}://${parsed.domain}/project/overview?id=${projectKey}`
        break
      default:
        throw new Error(`Unsupported endpoint ${parsed.domain}`)
    }

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router

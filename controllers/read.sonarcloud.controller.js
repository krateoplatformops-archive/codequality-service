const express = require('express')
const router = express.Router()
const uriHelpers = require('../helpers/uri.helpers')
const stringHelpers = require('../helpers/string.helpers')
const { logger } = require('../helpers/logger.helpers')
const axios = require('axios')
const metricHelpers = require('../helpers/metric.helpers')

router.get('/:endpoint/:key', async (req, res, next) => {
  try {
    const endpoint = JSON.parse(stringHelpers.b64toAscii(req.params.endpoint))
    const projectKey = stringHelpers.b64toAscii(req.params.key)

    logger.debug(endpoint)

    const token = endpoint.secret.find((x) => x.key === 'token')

    const headers = {
      Authorization: `Basic ${stringHelpers.to64(token.val + ':')}`
    }

    const metrics = [
      'alert_status',
      'bugs',
      'reliability_rating',
      'vulnerabilities',
      'security_rating',
      'security_hotspots_reviewed',
      'security_review_rating',
      'code_smells',
      'sqale_rating',
      'coverage',
      'duplicated_lines_density'
    ]

    const apis = [
      {
        url: `qualitygates/project_status?projectKey=${projectKey}`,
        key: 'project'
      },
      {
        url: `components/show?component=${projectKey}`,
        key: 'component',
        prop: 'component'
      },
      {
        url: `measures/component?component=${projectKey}&metricKeys=${metrics.join(
          ','
        )}`,
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

    let response = Object.assign({}, ...content)
    response.metrics = response.metrics.measures.map((v) => {
      return {
        metric: v.metric,
        label: v.metric.replace(/[_]/gm, ' '),
        value: metricHelpers.value(v.metric, v.value),
        color: metricHelpers.color(v.metric, v.value),
        icon: metricHelpers.icon(v.metric)
      }
    })

    res.status(200).json(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router

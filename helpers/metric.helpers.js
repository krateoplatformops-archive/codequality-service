const icon = (metric) => {
  switch (metric) {
    case 'bugs':
      return 'fa-solid fa-bug'
    case 'vulnerability':
      return 'fa-solid fa-bug'
    case 'code_smells':
      return 'fa-solid fa-code'
    case 'security_review_rating':
    case 'security_hotspots_reviewed':
    case 'security_rating':
      return 'fa-solid fa-shield'
    case 'vulnerabilities':
      return 'fa-solid fa-explosion'
    case 'duplicated_lines_density':
      return 'fa-solid fa-copy'
    case 'reliability_rating':
      return 'fa-solid fa-cogs'
    case 'alert_status':
      return 'fa-solid fa-exclamation-triangle'
    case 'sqale_rating':
      return 'fa-solid fa-chart-line'
    default:
      return 'fa-solid fa-question-circle'
  }
}

const color = (metric, value) => {
  switch (metric) {
    case 'bugs':
      if (parseInt(value) === 0) return 'Green'
      return 'Red'
    case 'vulnerabilities':
      if (parseInt(value) === 0) return 'Green'
      return 'Red'
    case 'duplicated_lines_density':
      let v = parseFloat(value)
      if (v < 10) return 'Green'
      if (v < 20) return 'Yellow'
      if (v < 30) return 'Orange'
      return 'Red'
    case 'alert_status':
      if (value === 'OK') return 'Green'
      return 'Red'
    case 'reliability_rating':
      const rr = parseFloat(value)
      if (rr === 1) return 'Green'
      if (rr === 2) return 'Yellow'
      if (rr === 3) return 'Orange'
      return 'Red'
    default:
      return 'Unknown'
  }
}

const value = (metric, value) => {
  switch (metric) {
    case 'reliability_rating':
      const l = ['A', 'B', 'C', 'D', 'E']
      const index = parseInt(value) - 1
      if (l[index]) return l[index]
      return l[l.length - 1]
    default:
      return value
  }
}

module.exports = {
  icon,
  color,
  value
}

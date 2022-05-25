const icon = (metric) => {
  switch (metric) {
    case 'bugs':
      return 'fa-solid fa-bug'
    case 'vulnerability':
      return 'fa-solid fa-bug'
    case 'code_smells':
      return 'fa-solid fa-code'
    case 'security_rating':
      return 'fa-solid fa-shield'
    case 'vulnerabilities':
      return 'fa-solid fa-explosion'
    case 'reliability_rating':
      return 'fa-solid fa-cogs'
    case 'alert_status':
      return 'fa-solid fa-exclamation-triangle'
    case 'coverage':
      return 'fa-solid fa-chart-line'
    case 'comment_lines':
      return 'fa-solid fa-comment'
    case 'duplicated_files':
      return 'fa-solid fa-copy'
    case 'files':
      return 'fa-solid fa-file'
    case 'directories':
      return 'fa-solid fa-folder'
    case 'lines':
      return 'fa-solid fa-code'
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
    case 'alert_status':
      if (value === 'OK') return 'Green'
      return 'Red'
    case 'code_smells':
      if (parseInt(value) === 0) return 'Green'
      return 'Orange'
    case 'reliability_rating':
    case 'security_rating':
      if (parseInt(value) <= 1) return 'Green'
      return 'Red'
    case 'coverage':
      if (parseInt(value) > 50) return 'Green'
      if (parseInt(value) > 30) return 'Orange'
      return 'Red'
    case 'duplicated_files':
      if (parseInt(value) === 0) return 'Green'
      return 'Red'
    case 'comment_lines':
    case 'files':
    case 'directories':
    case 'lines':
      return 'Green'
    default:
      return 'Unknown'
  }
}

const l = ['A', 'B', 'C', 'D', 'E']
const value = (metric, value) => {
  switch (metric) {
    case 'reliability_rating':
    case 'security_rating':
      const index = parseInt(value) - 1
      if (l[index]) return l[index]
      return l[l.length - 1]
    case 'comment_lines':
    case 'files':
    case 'directories':
    case 'lines':
      return value.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ' ')
    default:
      return value
  }
}

module.exports = {
  icon,
  color,
  value
}

/* This code is a refactoring of the Gramener senate project */
/* https://gramener.com/playground/senate/similarity */

/* global d3 */

function $(query) {
  if (typeof query === 'object') return query

  const result = document.querySelectorAll(query)

  return result[1] ? result : result[0]
}

const margin = { top: 0, right: 0, bottom: 0, left: 0 }
const width = 900 - margin.left - margin.right
const height = 430 - margin.top - margin.bottom

const svg = d3
  .select('#similarity')
  .append('div')
  .classed('svg-container', true)
  .append('svg')
  .attr('width', '100%')
  .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .classed('svg-content-responsive', true)

const radiusListJaro = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0]
const compressor = 200
let originX = 200
let originY = 200

svg
  .append('text')
  .attr('class', 'simil-chartheader')
  .tspans(() => {
    const aboutString2 = 'Voting Patterns of Senators'
    return d3.wordwrap(aboutString2, 50)
  })
  .attr('class', 'tspancls')
  .attr('x', 460)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 12.5)

svg
  .append('text')
  .attr('class', 'simil-sectionheader')
  .tspans(() => {
    const aboutString2 = `The dark stroked circle at the center is the selected senator.
      The distance between the senator and other senators around him/her defines the voting similarity score. Closer to the center greater the similarity in voting pattern and vice versa.
      The arc position is the senator's ideology score. The ideology score is a scale from 1, being most liberal, to 0, being most conservative.`
    return d3.wordwrap(aboutString2, 50)
  })
  .attr('class', 'tspancls')
  .attr('x', 460)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 35)

svg
  .append('text')
  .attr('class', 'simil-sectionheader')
  .tspans(() => {
    const aboutString3 = 'Click on any senator to view the Voting Similarity score.'
    return d3.wordwrap(aboutString3, 50)
  })
  .attr('class', 'tspancls')
  .attr('x', 460)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 160)

const bluffCircles = { I: '#83BF17', R: '#F15D58', D: '#59C8DF' }

const legCircles = [
  { cx: 465, cy: 180, col: '#F15D58', party: 'Rep' },
  { cx: 505, cy: 180, col: '#59C8DF', party: 'Dem' },
  { cx: 545, cy: 180, col: '#83BF17', party: 'Ind' },
]

svg
  .selectAll('.legcircle')
  .data(legCircles)
  .enter()
  .append('circle')
  .attr('class', 'legcircle')
  .attr('cx', d => d.cx)
  .attr('cy', d => d.cy)
  .attr('r', 5)
  .attr('stroke', 'black')
  .attr('stroke-width', 0.5)
  .attr('fill', d => d.col)

svg
  .append('line')
  .attr('x1', originX)
  .attr('y1', 0)
  .attr('x2', originX)
  .attr('y2', 400)
  .style('stroke-width', 2)
  .style('stroke', '#bdbdbd')
  .style('fill', 'none')
  .attr('stroke-dasharray', '5,5')
  .attr('stroke-dashoffset', 100)

svg
  .append('line')
  .attr('x1', 0)
  .attr('y1', originY)
  .attr('x2', 400)
  .attr('y2', originY)
  .style('stroke-width', 2)
  .style('stroke', '#bdbdbd')
  .style('fill', 'none')
  .attr('stroke-dasharray', '5,5')
  .attr('stroke-dashoffset', 100)

svg
  .append('text')
  .tspans(() => {
    const aboutString2 = 'Conservative'
    return d3.wordwrap(aboutString2, 50)
  })
  .attr('x', 300)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 100)
  .style('fill', bluffCircles.R)
  .style('font-weight', 'bold')

svg
  .append('text')
  .tspans(() => {
    const aboutString2 = 'Center-right'
    return d3.wordwrap(aboutString2, 50)
  })
  .attr('x', 300)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 300)
  .style('fill', bluffCircles.R)
  .style('font-weight', 'bold')

svg
  .append('text')
  .tspans(() => {
    const aboutString2 = 'Liberal'
    return d3.wordwrap(aboutString2, 50)
  })
  .attr('x', 100)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 100)
  .attr('text-anchor', 'end')
  .style('fill', bluffCircles.D)
  .style('font-weight', 'bold')

svg
  .append('text')
  .tspans(() => {
    const aboutString2 = 'Center-left'
    return d3.wordwrap(aboutString2, 50)
  })
  .attr('x', 100)
  .attr('dy', (m, i) => i * 15)
  .attr('y', 300)
  .attr('text-anchor', 'middle')
  .style('fill', bluffCircles.D)
  .style('font-weight', 'bold')

svg
  .selectAll('.legtext')
  .data(legCircles)
  .enter()
  .append('text')
  .attr('class', 'legtext')
  .attr('x', d => d.cx + 7.5)
  .attr('y', d => d.cy + 2.5)
  .text(d => d.party)

radiusListJaro.forEach(point => {
  svg
    .append('circle')
    .attr('class', 'senator')
    .attr('cx', originX)
    .attr('cy', originY)
    .attr('r', compressor - point * compressor)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-dasharray', '25,25')
    .attr('stroke-dashoffset', 100)
    .transition()
    .duration(1500)
    .ease(d3.easePoly)
    .attr('stroke', () => '#bdbdbd')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '2,2')
    .attr('stroke-dashoffset', 0)

  svg
    .append('text')
    .attr('class', 'senator')
    .attr('x', originX + (compressor - point * compressor) + 1.5)
    .attr('y', originY)
    .style('font-size', '6.5px')
    .text(`${point * 100}%`)
})

const senatorIdeology = {}

d3.csv('data/senate-115-ideology.csv', (error, ideoData) => {
  ideoData.forEach(datum => {
    senatorIdeology[datum.name] = datum.ideology
  })
})

function getIdeology(senator) {
  const senatorName = senator.split(/ \(/)[0]
  return Number(senatorIdeology[senatorName])
}

let voteTitleDict
let allvotes
let voteresultDict

d3.csv('data/senate-115-votes-summary.csv', (error, data3) => {
  voteTitleDict = {}
  allvotes = []
  voteresultDict = {}
  data3.forEach(point => {
    voteTitleDict[point.vote_number] = point.title
    voteresultDict[point.vote_number] = point.result
    allvotes.push(point.vote_number)
  })
})

let senIdDict
let senIdColor
let idSenatorDict
let imageIdDict
let senatorPartyDict

d3.csv('data/unique-senators.csv', (error, data2) => {
  const colorParty = { R: '#F15D58', D: '#59C8DF', I: '#83BF17' }

  senIdDict = {}
  senIdColor = {}
  idSenatorDict = {}
  imageIdDict = {}
  senatorPartyDict = {}

  data2.forEach(point => {
    senIdDict[point.member_full] = point.lis_member_id
    senIdColor[point.member_full] = colorParty[point.party]
    idSenatorDict[point.lis_member_id] = point.member_full
    imageIdDict[point.member_full] = point.image_id
    senatorPartyDict[point.member_full] = point.party
  })

  svg
    .selectAll('.senators')
    .data(data2)
    .enter()
    .append('circle')
    .attr('class', 'senators')
    .attr('id', d => d.lis_member_id)
    .attr('data-senator', d => d.member_full)
    .attr('cx', d => {
      if (d.member_full === 'Sessions (R-AL)' || d.member_full === 'Strange (R-AL)') {
        return -100
      }
      return 200
    })
    .attr('cy', d => {
      if (d.member_full === 'Sessions (R-AL)' || d.member_full === 'Strange (R-AL)') {
        return -100
      }
      return 200
    })
    .attr('r', 5)
    .attr('fill', d => colorParty[d.party])
    .attr('stroke', 'black')
    .attr('opacity', 0)
    .attr('data-title', d => d.member_full)
})

function sessionsOrStrange(target) {
  return target.dataset.senator === 'Sessions (R-AL)' || target.dataset.senator === 'Strange (R-AL)'
}

function visualupdate(senator) {
  d3.selectAll('.othersenator').remove()
  d3.selectAll('.senatorname').remove()
  d3.select('.othersenatorname').remove()
  d3.select('.jaroheader').remove()
  d3.select('.jaroheadernum').remove()

  d3
    .selectAll('.senatorimage')
    .attr('opacity', 1)
    .transition()
    .duration(2500)
    .ease(d3.easeLinear)
    .attr('opacity', 0)
    .remove()

  d3
    .select('.fatext')
    .attr('opacity', 1)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr('opacity', 0)
    .remove()

  d3.csv('data/pattern-similarity-jaro.csv', (error, data) => {
    const currentSenator = data.filter(d => {
      if (d.senator_x === senator || d.senator_y === senator) {
        return d
      }

      return null
    })

    const curSenDict = {}

    currentSenator.forEach(d => {
      if (d.senator_x !== senator) {
        curSenDict[d.senator_x] = d['jaro distance']
      } else {
        curSenDict[d.senator_y] = d['jaro distance']
      }
    })

    const zeroDecimal = d3.format('.0f')

    originX = 200
    originY = 200

    d3
      .selectAll('.senators')
      .attr('cx', function() {
        if (sessionsOrStrange(this)) {
          return -100
        }
        return $(this).getAttribute('cx')
      })
      .attr('cy', function() {
        if (sessionsOrStrange(this)) {
          return -100
        }
        return $(this).getAttribute('cy')
      })
      .attr('opacity', function() {
        if (sessionsOrStrange(this)) {
          return 0
        }
        return 1
      })
      .attr('data-jaro', function() {
        return curSenDict[this.dataset.senator] * 100
      })
      .attr('fill', function() {
        return senIdColor[this.dataset.senator]
      })
      .transition()
      .duration(500)
      .delay((d, i) => i * 5)
      .ease(d3.easePoly)
      .attr('r', 5)
      .attr('cx', function() {
        if (sessionsOrStrange(this)) {
          return -100
        }
        return (
          originX +
          (compressor - curSenDict[this.dataset.senator] * compressor) *
            Math.sin(-1 * getIdeology(this.dataset.senator) * 2 * Math.PI)
        )
      })
      .attr('cy', function() {
        if (sessionsOrStrange(this)) {
          return -100
        }
        return (
          originY -
          (compressor - curSenDict[this.dataset.senator] * compressor) *
            Math.cos(-1 * getIdeology(this.dataset.senator) * 2 * Math.PI)
        )
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5)

    d3
      .select(`#${senIdDict[senator]}`)
      .attr('cx', function() {
        return $(this).getAttribute('cx')
      })
      .attr('cy', function() {
        return $(this).getAttribute('cy')
      })
      .transition()
      .duration(500)
      .ease(d3.easePoly)
      .attr('fill', 'none')
      .attr('r', 10)
      .attr('cx', originX)
      .attr('cy', originY)
      .attr('stroke-width', 2.5)
      .attr('data-original-title', () => senator)

    svg
      .append('filter')
      .attr('id', 'Rep')
      .append('feColorMatrix')
      .attr('values', '0.6666 0.6666 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0')

    svg
      .append('filter')
      .attr('id', 'Ind')
      .append('feColorMatrix')
      .attr('type', 'grayscale')
      .attr('values', '0.3333 0.3333 0.6666 0 0 0.6666 0.5555 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0')

    svg
      .append('filter')
      .attr('id', 'Dem')
      .append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0.85 0 0 0 0.05 0.85 0 0 0 0.15 0.50 0 0 0 0.50 0 0 0 1 0')

    svg
      .append('filter')
      .attr('id', 'Gen')
      .append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0')

    svg
      .append('image')
      .attr('class', 'senatorimage')
      .attr('filter', () => 'url("#Gen")')
      .attr('opacity', 1)
      .attr('xlink:href', () => `images/${imageIdDict[senator]}.jpegcopy.png`)
      .attr('width', 50)
      .attr('height', 50)
      .attr('x', 460)
      .attr('y', 197.5)

    svg
      .append('circle')
      .attr('class', 'senatorimage')
      .attr('cx', 485)
      .attr('cy', 222)
      .attr('r', 22)
      .attr('fill', 'none')
      .attr('stroke', bluffCircles[senatorPartyDict[senator]])
      .attr('stroke-width', 3)

    svg
      .append('text')
      .attr('class', 'senatorname')
      .tspans(() => {
        const senatorName = senator
        return d3.wordwrap(senatorName, 50)
      })
      .attr('class', 'tspancls')
      .attr('x', 460)
      .attr('dy', (m, i) => i * 15)
      .attr('y', 257.5)

    svg
      .append('text')
      .attr('class', 'senatorname')
      .tspans(() => {
        const senatorName = senator
        return d3.wordwrap(`Ideology score: ${getIdeology(senatorName).toFixed(2)}`, 50)
      })
      .attr('class', 'tspancls')
      .attr('x', 460)
      .attr('dy', (m, i) => i * 15)
      .attr('y', 267.5)

    function cosenator(otherSenator, otherSenatorX, otherSenatorY, otherSenatorJaro) {
      d3
        .selectAll('.othersenator')
        .attr('opacity', 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('opacity', 0)
        .remove()

      d3
        .selectAll('.othersenatorname')
        .attr('opacity', 1)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('opacity', 0)
        .remove()

      d3
        .select('.fatext')
        .attr('opacity', 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr('opacity', 0)
        .remove()

      d3.select('.jaroheader').remove()

      d3
        .select('.jaroheadernum')
        .attr('opacity', 1)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr('opacity', 0)
        .remove()

      svg
        .append('image')
        .attr('class', 'othersenator')
        .attr('filter', () => 'url("#Gen")')
        .attr('data-othersenator', otherSenator)
        .attr('opacity', 1)
        .attr('xlink:href', () => `images/${imageIdDict[otherSenator]}.jpegcopy.png`)
        .attr('width', 50)
        .attr('height', 50)
        .attr('x', otherSenatorX)
        .attr('y', otherSenatorY)
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .attr('x', 560)
        .attr('y', 197.5)

      svg
        .append('circle')
        .attr('class', 'othersenator')
        .attr('cx', otherSenatorX)
        .attr('cy', otherSenatorY)
        .attr('r', 5)
        .transition()
        .duration(1000)
        .ease(d3.easePoly)
        .attr('cx', 585)
        .attr('cy', 222)
        .attr('r', 22)
        .attr('fill', 'none')
        .attr('stroke', bluffCircles[senatorPartyDict[otherSenator]])
        .attr('stroke-width', 3)

      svg
        .append('text')
        .attr('class', 'othersenatorname')
        .tspans(() => {
          const otherSenatorName = otherSenator
          return d3.wordwrap(otherSenatorName, 50)
        })
        .attr('class', 'tspancls')
        .attr('x', 560)
        .attr('dy', (m, i) => i * 15)
        .attr('y', 257.5)

      svg
        .append('text')
        .attr('class', 'othersenatorname')
        .tspans(() => {
          const otherSenatorName = otherSenator
          return d3.wordwrap(`Ideology score: ${getIdeology(otherSenatorName).toFixed(2)}`, 50)
        })
        .attr('class', 'tspancls')
        .attr('x', 560)
        .attr('dy', (m, i) => i * 15)
        .attr('y', 267.5)

      svg
        .append('text')
        .attr('class', 'jaroheadernum')
        .tspans(() => {
          const aboutJaro = `${zeroDecimal(otherSenatorJaro)}%`
          return d3.wordwrap(aboutJaro, 50)
        })
        .attr('class', 'tspancls')
        .attr('x', 520)
        .attr('dy', (m, i) => i * 15)
        .attr('y', 290.5)

      svg
        .append('text')
        .attr('class', 'jaroheader')
        .tspans(() => {
          const aboutJaro = 'Voting Similarity'
          return d3.wordwrap(aboutJaro, 50)
        })
        .attr('class', 'tspancls')
        .attr('x', 475)
        .attr('dy', (m, i) => i * 15)
        .attr('y', 315.5)
    }

    d3.selectAll('.senators').on('click', function() {
      const otherSenator = $(this).dataset.senator
      const otherSenatorX = $(this).getAttribute('cx')
      const otherSenatorY = $(this).getAttribute('cy')
      const otherSenatorJaro = $(this).dataset.jaro
      return cosenator(otherSenator, otherSenatorX, otherSenatorY, otherSenatorJaro)
    })
  })
}

$('.selectpicker').addEventListener('change', function() {
  const selected = $(this)[$(this).selectedIndex]
  const senator = selected.value

  return visualupdate(senator)
})

visualupdate('Paul (R-KY)')

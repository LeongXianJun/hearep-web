import React, { FC, useState } from 'react'
import {
  VictoryChart, VictoryLine, VictoryBrushContainer, VictoryAxis,
  DomainTuple, VictoryTooltip, createContainer, VictoryGroup, VictoryScatter,
} from 'victory'
import { Grid } from '@material-ui/core'
import { VictoryZoomContainerProps } from 'victory-zoom-container'
import { VictoryVoronoiContainerProps } from 'victory-voronoi-container'

interface ComponentProps {
  data: Array<{ x: any, y: any }>
  minZoom?: number
  color?: string
  showSymbol?: boolean
  yLabel?: string
}

const LineGraphWithZoom: FC<ComponentProps> = ({ data, color = 'tomato', minZoom = 1, showSymbol, yLabel }) => {
  const VictoryZoomVoronoiContainer = createContainer<VictoryZoomContainerProps, VictoryVoronoiContainerProps>('zoom', 'voronoi')

  const [ selectedDomain, setSelectedDomain ] = useState<{ x: DomainTuple, y: DomainTuple }>()
  const [ zoomDomain, setZoomDomain ] = useState<{ x: DomainTuple, y: DomainTuple }>()

  const handleZoom = (domain: { x: DomainTuple, y: DomainTuple }) => {
    setSelectedDomain(domain)
  }

  const handleBrush = (domain: { x: DomainTuple, y: DomainTuple }) => {
    setZoomDomain(domain)
  }

  return (
    <Grid container justify='center' alignItems='center'>
      <Grid item xs>
        <VictoryChart
          animate={ { duration: 2000 } }
          height={ 250 }
          minDomain={ { y: 0 } }
          scale={ { x: data[ 0 ]?.x instanceof Date ? "time" : 'linear' } }
          padding={ { top: 40, left: 40, right: 40, bottom: 30 } }
          domainPadding={ { x: 5, y: 5 } }
          containerComponent={
            <VictoryZoomVoronoiContainer
              zoomDimension='x'
              zoomDomain={ zoomDomain }
              minimumZoom={ { x: minZoom, y: 1 } }
              onZoomDomainChange={ handleZoom }
            />
          }
        >
          <VictoryAxis dependentAxis
            tickValues={ data.map(d => d.y) }
            tickFormat={ y => y.toPrecision(3) }
          />
          <VictoryAxis />
          <VictoryGroup
            style={ {
              data: { stroke: color }
            } }
            data={ data }
            labels={ ({ datum }) => (yLabel ? yLabel + ': ' : '') + datum.y }
            labelComponent={
              <VictoryTooltip
                style={ { fill: color, fontSize: '10px' } }
                flyoutStyle={ { stroke: color, strokeWidth: 0.5 } }
                renderInPortal={ false }
              />
            }
          >
            <VictoryLine />
            { showSymbol && <VictoryScatter /> }
          </VictoryGroup>
        </VictoryChart>
        <VictoryChart
          animate={ { duration: 2000 } }
          height={ 60 }
          minDomain={ { y: 0 } }
          scale={ { x: data[ 0 ]?.x instanceof Date ? "time" : 'linear' } }
          padding={ { top: 0, left: 40, right: 40, bottom: 30 } }
          domainPadding={ { x: 5, y: 5 } }
          containerComponent={
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={ selectedDomain }
              onBrushDomainChange={ handleBrush }
            />
          }
        >
          <VictoryAxis />
          <VictoryLine
            style={ {
              data: { stroke: color }
            } }
            data={ data }
          />
        </VictoryChart>
      </Grid>
    </Grid>
  )
}

export default LineGraphWithZoom
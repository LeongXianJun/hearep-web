import React, { FC, useState } from 'react'
import {
  VictoryChart, VictoryLine, VictoryBrushContainer, VictoryAxis,
  DomainTuple, VictoryTooltip, createContainer, VictoryGroup, VictoryScatter
} from 'victory'
import { Grid } from '@material-ui/core'
import { VictoryZoomContainerProps } from 'victory-zoom-container'
import { VictoryVoronoiContainerProps } from 'victory-voronoi-container'

interface ComponentProps {
  data: Array<{ x: any, y: any }>
  minZoom?: number
  color?: string
  showSymbol?: boolean
}

const LineGraph: FC<ComponentProps> = ({ data, color = 'tomato', minZoom = 1, showSymbol }) => {
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
          height={ 200 }
          minDomain={ { y: 0 } }
          scale={ { x: data[ 0 ].x instanceof Date ? "time" : 'linear' } }
          padding={ { top: 30, left: 30, right: 30, bottom: 30 } }
          containerComponent={
            <VictoryZoomVoronoiContainer
              zoomDimension='x'
              zoomDomain={ zoomDomain }
              minimumZoom={ { x: minZoom, y: 1 } }
              onZoomDomainChange={ handleZoom }
            />
          }
        >
          <VictoryGroup
            style={ {
              data: { stroke: color }
            } }
            data={ data }
            labels={ d => parseInt(d.y) }
            labelComponent={ <VictoryTooltip style={ { fill: color, fontSize: '10px' } } flyoutStyle={ { stroke: color, strokeWidth: 0.5 } } /> }
          >
            <VictoryLine />
            { showSymbol && <VictoryScatter /> }
          </VictoryGroup>
        </VictoryChart>
        <VictoryChart
          height={ 60 }
          minDomain={ { y: 0 } }
          scale={ { x: data[ 0 ].x instanceof Date ? "time" : 'linear' } }
          padding={ { top: 0, left: 30, right: 30, bottom: 30 } }
          containerComponent={
            <VictoryBrushContainer
              brushDimension="x"
              brushDomain={ selectedDomain }
              onBrushDomainChange={ handleBrush }
            />
          }
        >
          <VictoryAxis
            tickValues={ data.map(d => d.x) }
            tickFormat={ x => x instanceof Date ? new Date(x).getFullYear() : x }
          />
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

export default LineGraph
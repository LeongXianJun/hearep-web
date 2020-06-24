import React, { FC } from 'react'
import {
  VictoryChart, VictoryLine, VictoryTooltip, VictoryGroup, VictoryScatter, VictoryVoronoiContainer
} from 'victory'
import { Grid } from '@material-ui/core'

interface ComponentProps {
  data: Array<{ x: any, y: any }>
  color?: string
  showSymbol?: boolean
  yLabel?: string
}

const LineGraph: FC<ComponentProps> = ({ data, color = 'tomato', showSymbol, yLabel }) => {
  return (
    <Grid container justify='center' alignItems='center'>
      <Grid item xs>
        <VictoryChart
          animate={ { duration: 2000 } }
          height={ 200 }
          minDomain={ { y: 0 } }
          scale={ { x: data[ 0 ]?.x instanceof Date ? "time" : 'linear' } }
          padding={ { top: 30, left: 30, right: 30, bottom: 30 } }
          domainPadding={ { x: 5, y: 5 } }
          containerComponent={
            <VictoryVoronoiContainer />
          }
        >
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
      </Grid>
    </Grid>
  )
}

export default LineGraph
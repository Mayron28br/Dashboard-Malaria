import React from 'react'
import './visualization.css'
import Header from '../../components/Header'
import Cases from './charts/Cases'
import CasesByCity from './charts/CasesByCity'
import RadarChart from './charts/RadarChart'

const Visualization = () => {
  return (
    <div>
      <Header/>
      <Cases />
      <CasesByCity />
      <RadarChart />
    </div>
  )
}

export default Visualization

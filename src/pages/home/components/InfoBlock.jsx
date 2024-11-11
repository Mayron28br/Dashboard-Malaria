import React from 'react'
import './InfoBlock.css'
import ImageChart from '../../../assets/chart-image.png'

const InfoBlock = () => {
  return (
    <div className='InfoBlock'>
        <div className='text'>
            <h1>Visualização de Dados da Malária</h1>
            <p>A Plataforma de Visualização de Dados da Malária (VD Malária) é uma solução web interativa desenvolvida para
                facilitar o acesso e a compreensão dos dados relacionados à infecção e propagação da malária na Amazônia Legal Brasileira. 
                A plataforma visa oferecer uma visão abrangente sobre o cenário da malária na região, permitindo análises aprofundadas e informadas.</p>
            <p>Por meio desta plataforma é possível explorar diversas visualizações tanto estáticas quanto interativas.</p>
        </div>
        <div className='ImageBlock'>
            <img src={ImageChart} alt="" />
        </div>
    </div>
  )
}

export default InfoBlock

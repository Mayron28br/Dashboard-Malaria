import React from 'react'
import './Home.css'
import Header from '../../components/Header'
import InfoBlock from './components/InfoBlock'
import InfoLink from './components/InfoLink'
import DashBoardImage from '../../assets/Dashboard.png'
import Visualizacao from '../../assets/visualizacao.png'

const Home = () => {
  return (
    <div>
      <Header />
      <InfoBlock />
      <InfoLink image={DashBoardImage} 
      title='Dashboard Malária'
      subTitle='Monitoramento Interativo e Painel de Indicadores'
      text='uma ferramenta interativa desenvolvida para monitorar e analisar dados relacionados à 
      incidência, controle e prevenção da malária. Este dashboard oferece uma visão 
      abrangente sobre a distribuição geográfica, taxas de infecção, tratamentos aplicados 
      e avanços no combate à doença.' 
      link="/dashboard"/>
      <InfoLink image={Visualizacao} 
      title='Visualização de Dados'
      subTitle='Explorando Dados para Combater a Malária com Eficiência'
      text='Explore nossa galeria de visualizações prontas sobre a malária, Cada visualização foi 
      projetada para destacar informações essenciais, como áreas de maior incidência, sazonalidade 
      dos casos e impacto de iniciativas de controle. Perfeita para análise rápida e suporte à 
      tomada de decisões estratégicas.'
      link="/visualizacao"/>
    </div>
  )
}

export default Home

import React from 'react'
import './InfoLink.css'
import { Link } from 'react-router-dom'
import Button from '../../../components/Button'

const InfoLink = ({image, title, subTitle, text, link}) => {
  return (
    <div className='InfoLink'>
        <div className='Image'>
            <img src={image}/>
        </div>
        <div className='Text'>
            <h1 className='Title'>{title}</h1>
            <h3>{subTitle}</h3>
            <p>{text}</p>
            <Link className='Link' to={link}><Button ButtonTitle='Veja Mais'/></Link>
        </div>
    </div>
  )
}

export default InfoLink

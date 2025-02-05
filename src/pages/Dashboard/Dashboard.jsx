import React from 'react'
import "../../assets/styles/components/dashboard.css"
import CustomerAnalysis from '../../components/Customer/CustomerAnalysis'
import Logo from '../../assets/images/sumber-sari.png'
import LastFiveDiscounts from '../../components/Customer/LastFiveDiscounts'
const Dashboard = () => {
  return (
    <div className="wewss">

    <div className='container dashboard--container'>
      <div className="titles">Menu Utama</div>
      <div className="entry">
      <img src={Logo} alt="" />
      <p className="salam">SELAMAT DATANG DI MENU UTAMA SUMBER SARI</p>
      </div>



    </div>
      <div className="container dashboard--content">
      <CustomerAnalysis/>
      </div>
      <div className="container bawah">
        <LastFiveDiscounts/>
      </div>
    </div>
  )
}

export default Dashboard

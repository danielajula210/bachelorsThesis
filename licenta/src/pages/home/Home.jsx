import React from 'react'
import "./home.css"
import Tbar from '../../components/tbar/Tbar'
import Screenleft from '../../components/screenleft/Screenleft'
import Activity from '../../components/activity/Activity'
import Screenright from '../../components/screenright/Screenright'

export default function Home() {
  return (
    <>
      <Tbar/>{/*Afiseaza componenta Tbar */}
      <div className="homeContainer">
        <Screenleft/>{/*Afiseaza componenta ScreenLeft */}
        <Activity/>{/*Afiseaza componenta Activity */}
        <Screenright/>{/*Afiseaza componenta Screenright */}
      </div>
    </>
  )
}

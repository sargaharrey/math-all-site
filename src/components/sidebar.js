import React, { useState, useEffect } from 'react';
import { BsGraphDown, BsGrid } from 'react-icons/bs';
import { FaSun, FaMoon, FaCalculator, FaSuperscript, FaSquareRootAlt, FaBars, FaWaveSquare, FaChartLine, FaChartBar, FaInfinity, FaRulerCombined, FaAtom, FaFlask, FaProjectDiagram, FaChevronDown, FaParagraph } from 'react-icons/fa';

import { Link } from 'react-router-dom';


import GraphOptions from './graphOptions';

const logo = require('../assets/logo.png');

const Sidebar = (props) => {



    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    const [theme, setTheme] = useState('light');
    const [currentOpen, setCurrentOpen] = useState('quadratic');



    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);






    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        props.setTheme(theme === 'light' ? 'dark' : 'light')
    }

    const toggleSidebar = (current) => {
        setIsOpen(!isOpen);
        setCurrentOpen(current)
    }




    return (
        <>
            {isMobile ? <div style={{ backgroundColor: '#222', color: '#fff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', top: 10, left: 10, position: 'fixed' }} onClick={() => setIsSidebarOpen(!isSidebarOpen)}> <FaBars size={24} /> </div> : ''
            }
            <div style={isMobile ? (isSidebarOpen ? styles.sidebarMobileOpen : styles.sidebarMobileClosed) : styles.sidebarDark}>
                <div style={styles.sidebarLogo}>
                    <Link to={'/'}>
                          <img src={logo}/>
                    </Link>
                   
                </div>
                {isMobile &&
                    <div onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{
                    position: 'absolute', zIndex: '1000000000', top: '20px',
                      background:'#fff',
                      width:'50px',
                      height:'50px',
                      color:'#222',  
                    right: '20px',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center'
                }}>
                    <FaBars size={18} 
                           /></div>} 
               
                {props.Graph === false ? (
                    <>
                        <div style={styles.dropdownToggle} onClick={toggleSidebar}>
                            {props.current ? props.current : 'Categories'}
                            <FaChevronDown />
                        </div>

                        <Link to={'/graph'}>
                            <button style={styles.graph}>
                                <span>Graphing</span> <span><BsGraphDown /></span>
                            </button>
                        </Link>

                        {isOpen && (
                            <ul style={styles.dropdownList}>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الرياضيات الأساسية')}><FaCalculator style={styles.icon} />  الرياضيات الأساسية</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الجبر')}><FaSuperscript style={styles.icon} />  الجبر</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('ما قبل الجبر')}><FaSquareRootAlt style={styles.icon} />  ما قبل الجبر</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الثلاثيات')}><FaWaveSquare style={styles.icon} /> الثلاثيات</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent(' ما قبل التفاضل والتكامل')}><FaChartLine style={styles.icon} />  ما قبل التفاضل والتكامل</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('التفاضل والتكامل')}><FaChartLine style={styles.icon} /> التفاضل والتكامل</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الإحصاء')}><FaChartBar style={styles.icon} />  الإحصاء</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الرياضيات المنتهية')}><FaInfinity style={styles.icon} /> الرياضيات المنتهية</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الجبر الخطي')}><FaRulerCombined style={styles.icon} />  الجبر الخطي</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الفيزياء')}><FaAtom style={styles.icon} />  الفيزياء</li>
                                <li style={styles.listItem} onClick={() => props.setCurrent('الكيمياء')}><FaFlask style={styles.icon} />  الكيمياء</li>

                            </ul>

                        )}



                        <div style={styles.themeToggle} onClick={toggleTheme}>
                            {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />}
                        </div>
                    </>
                ) : (
                    <GraphOptions />
                )}



            </div>


        </>
    );
}




const styles = {
    sidebarLight: {
        width: '350px',
        backgroundColor: '#fff',
        color: '#222',
        padding: '20px',
        transition: 'all 0.3s',
        zIndex: '2',
        position: 'relative',
 
        overflow:'auto'
    },
    sidebarDark: {
        width: '350px',
        backgroundColor: '#222',
        color: '#fff',
        padding: '20px',
        transition: 'all 0.3s',
        zIndex: '2',
        position: 'relative',
    
        overflow: 'auto'
    },
    themeToggle: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        width: '50px',
        height: '50px',
    
        position: 'absolute', // this line positions the button absolutely
        bottom: '10px',       // 10px from the bottom of the sidebar
        right: '20px',         // Aligned with other buttons
    
        ':hover': {
            backgroundColor: '#555',
        },
    },
    graph: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        margin: '20px 0px',
        ':hover': {
            backgroundColor: '#555',
        },
    },

    submit: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        margin: '20px 0px',
        textAlign: 'center',
        ':hover': {
            backgroundColor: '#555',
        },
    },
    sidebarMobileClosed: {
        width: '0px',
        transition: 'all 0.3s',
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        left: '-350px',
         height:'100vh',
        zIndex: 1000,

    },
    sidebarMobileOpen: {
        width: '350px',
        backgroundColor: '#222',
        color: '#fff',
        padding: '20px',
        transition: 'all 0.3s',
        position: 'fixed',
        height: '100vh',
        overflow:'auto',
        top: 0,
        left: 0,
   
        zIndex: 1000,
    },
    sidebarLogo: {
        fontSize: '24px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', 
        img: {
            height: '10px', // or whatever height you prefer
            borderRadius: '20px' // this gives the rounded corners
        }
    },
    dropdownToggle: {
        cursor: 'pointer',
        padding: '10px 15px',
        backgroundColor: '#444',
        borderRadius: '5px',
        transition: 'background-color 0.2s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        ':hover': {
            backgroundColor: '#555',
        },
    },
    dropdownList: {
        maxHeight: '50vh',
        overflow: 'auto',
    },
    dropdownGraphLis: {

        overflow: 'auto',           // Allows the content to scroll
        maxHeight: '75vh',          // Set a maximum height
    },

    listItem: {
        padding: '8px 0',
        listStyleType: 'none',
        cursor: 'pointer',
        display: 'flex',            // Set this to flex
        alignItems: 'center',       // This will vertically align the items in the middle
        margin: '20px 0px',
        cursor: 'pointer'
    },
    listGraphItem: {
        marginTop: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        cursor: 'pointer'
    },
    icon: {                         // New style for the icon
        marginRight: '10px',
        display: 'inline'     // This adds spacing to the right of the icon
    },
    inputs: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
        width: '100%'
    },
    domain: {
        display: 'flex',
        flexDirection: 'column',

        input: {
            gap: '15px',
            marginTop: '15px',

            ':active': {
                border: '1px solid #ccc !important'
            },
            ':focus': {
                border: '2px solid #ccc!important'
            }
        }
    }

};

export default Sidebar;

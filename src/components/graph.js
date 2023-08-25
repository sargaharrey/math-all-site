import React, { useState, useRef, useEffect } from 'react';

const userAvatar = '...';
const botAvatar = '...';




const Graph = (props) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);



    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100vh',
            fontFamily: "'Noto Sans', sans-serif",
            color: '#333',
            width: !isMobile ? 'calc(100%)' : '100%',
            justifyContent: 'center'

        }}

            className={props.theme}
        >
            <div id='graph' style={styles.graph}></div>
        </div>
    );
};


const styles = {
    graph: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translateY(150px)'
    }
}
export default Graph;

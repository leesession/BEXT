import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from 'antd/lib/list/Item';
import partner from '../../image/partner/lianjinshu.png';

class Listdetail extends Component{

    render(){
        const arr=[0,1,2,3]
        return(
            <div id='part'>
                <ul>
                    {
                        arr.map(Item=>{
                            return <li>
                                     <a href='/' target='_blank'>
                                        <img src={partner}/>
                                        <div>
                                            <div>This is title {Item}</div>
                                            <div>This is a intro messageThis is a intro messageThis is a intro message</div>
                                        </div>
                                     </a>
                                 </li>
                        })
                    }               
                </ul>
            </div>
        );
    }
}
export default Listdetail
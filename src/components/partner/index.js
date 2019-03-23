import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from 'antd/lib/list/Item';
import partner from './partner'

import sprit from '../../image/partner/sprit.png'



class Listdetail extends Component{
    componentDidMount(){
        // console.log(partner)
    }
    render(){
        const partnerArr = [partner.partner_package,partner.partner_message,partner.partner_exchange]
        const series = [
            { name:'EOS钱包',num:0 }, 
            { name:'EOS信息平台',num:partnerArr[0].length},
            {name:'交易所',num:partnerArr[0].length+partnerArr[1].length},
        ]
      
        return(
            <div id='part'>
            {
                series.map((Items,index)=>{
                    return <div className='contain'>
                                <div className='series'>{Items.name}</div>
                                <ul>
                                {
                                    partnerArr[index].map((Item,indexs)=>{
                                        return <li>
                                                     <a href={Item.link} target='_blank'>
                                                          {/* <img src={Item.src} width='70' height='70'/> */}
                                                          <span style={{
                                                              backgroundImage:`url(${sprit}`,
                                                              backgroundPositionX:-(indexs+Items.num)*70+'px'
                                                              }}
                                                              className={
                                                                  (indexs+Items.num)==3?'logo4':
                                                                    (indexs+Items.num)==7?'logo8':
                                                                        (indexs+Items.num)==9?'logo10':
                                                                            (indexs+Items.num)==11?'logo12':
                                                                            (indexs+Items.num)==12?'logo13':''
                                                              }
                                                              ></span>
                                                          <div>
                                                             <div>{Item.name}</div>
                                                               <div>{Item.intro}</div>
                                                          </div>
                                                     </a>
                                              </li>
                                            
                                    })
                                }
                                </ul>
                            </div>
                })
            }
                
            </div>
        );
    }
}
export default Listdetail
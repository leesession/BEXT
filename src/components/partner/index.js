import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Item from 'antd/lib/list/Item';
import partner from './partner'
import lianjinshu from '../../image/partner/lianjinshu.png';
import bitpie from '../../image/partner/bitpie.png';
import buckWallet from '../../image/partner/buck_wallet.png';
import dexeo from '../../image/partner/dexeo.svg';
import findex from '../../image/partner/findex.png';
import maizi from '../../image/partner/maizi.svg';
import prochain from '../../image/partner/prochain.png';
import secrypto from '../../image/partner/secrypto.png';
import tokenPocket from '../../image/partner/TP.png';
import dappradar from '../../image/partner/dappradar.png';
import dappreview from '../../image/partner/dappreview.svg';
import spiderstore from '../../image/partner/spiderstore.svg';
import meet from '../../image/partner/meet.png';
import newdex from '../../image/partner/newdex.png';

class Listdetail extends Component{
    componentDidMount(){
        // console.log(partner)
    }
    render(){
        const partnerArr = [partner.partner_package,partner.partner_message,partner.partner_exchange]
        const series = ['EOS钱包','EOS信息平台','交易所']
        const imgArr=[[tokenPocket,meet,bitpie,secrypto,maizi,buckWallet],
                        [lianjinshu,dappradar,spiderstore,dappreview,prochain,],
                        [newdex,dexeo,findex]]
        return(
            <div id='part'>
            {
                series.map((Items,index)=>{
                    return <div className='contain'>
                                <div className='series'>{Items}</div>
                                <ul>
                                {
                                    partnerArr[index].map((Item,indexs)=>{
                                        return <li>
                                                     <a href={Item.link} target='_blank'>
                                                          {/* <img src={Item.src} width='70' height='70'/> */}
                                                          <span style={{backgroundImage:`url(${imgArr[index][indexs]}`}}></span>
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
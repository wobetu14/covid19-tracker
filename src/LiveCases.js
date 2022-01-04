import React from 'react'
import './LiveCases.css'
import { Table } from '@material-ui/core'

function LiveCases({countries}) {
    return (
        <div className='liveCases'>
            {
                countries.map(({country, cases})=>(
                    <tr>
                        <td>{country}</td>
                        <td>{cases}</td>
                    </tr>
                ))
            }
            
        </div>
    )
}

export default LiveCases

import React from 'react'
import './LiveCases.css'
import numeral from 'numeral'

// import { Table } from '@material-ui/core'

function LiveCases({countries}) {
    return (
        <div className='liveCases'>
            {
                countries.map(({id, country, cases})=>(
                    <tr key={id}>
                        <td>{country}</td>
                        <td>
                            <strong>{numeral(cases).format("0,0")}</strong>
                        </td>
                    </tr>
                ))
            }
            
        </div>
    )
}

export default LiveCases

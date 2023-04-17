import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Iproduct } from '../api/models';
import { getAll, remove } from '../api/products';

export default function Admin() {
    const navigate = useNavigate()
    const [products, setProducts] = useState<Iproduct[]>([])
    const showItem = async () => {
        const { data } = await getAll()
        setProducts(data)
    }
    useEffect(() => {
        showItem()
    }, [])
    const handelRemove = async(id: any) => {
        const conFirm = confirm('Are you sure you want to remove')
        if (conFirm) {
            const Remove = await remove(id)
            window.location.reload()
            console.log(Remove)
        }
    }
  return (
    <div>
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Product name
          </th>
          <th scope="col" className="px-6 py-3">
            Color
          </th>
          <th scope="col" className="px-6 py-3">
            Category
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
                      {products.map((item,index) => {
         return    <tr key={index} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
           {item.id}
          </th>
          <td className="px-6 py-4">
           {item.name}
          </td>
          <td className="px-6 py-4">
           {item.description}
          </td>
          <td className="px-6 py-4">
             {item.madein}
             </td>
             <td className="px-6 py-4">
             {item.price}
             </td>
             <td className="px-6 py-4">
             {item.trademart}
          </td>
          <td className="px-6 py-4">
            <button onClick={()=>{
                navigate(`/auth/admin/update/${item.id}`)
            }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                          </td>
                           <td className="px-6 py-4">
            <button onClick={()=>{
                handelRemove(item.id)
            }} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">delete</button>
          </td>
        </tr>
     })}
       
      </tbody>
    </table>
  </div>
</div>

  )
}

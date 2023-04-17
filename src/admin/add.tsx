import React from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AddForm, addSchema } from '../api/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { create } from '../api/products';

export default function Add() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState:{errors} } = useForm<AddForm>({
            resolver  : yupResolver(addSchema)
    })
    const onSubmit = async (data: AddForm) => {
        const AddItem = await create(data)
        alert("create item is successfully")
        navigate("/auth/admin")
        console.log(AddItem)
    }
  return (
      <div className='container mx-auto'>
          <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                  <input {...register("name")} className='w-[400px] h-[40px] my-5 border-2'/>
                  <p className='text-red-500'>{ errors.name && errors.name.message}</p>
              </div>
              <div>
                  <input {...register("description")} className='w-[400px] h-[40px] my-5 border-2'/>
                  <p className='text-red-500'>{ errors.description && errors.description.message}</p>
              </div>
              <div>
                  <input {...register("price")} className='w-[400px] h-[40px] my-5 border-2'/>
                  <p className='text-red-500'>{ errors.price && errors.price.message}</p>
              </div>
              <div>
                  <input {...register("trademart")} className='w-[400px] h-[40px] my-5 border-2'/>
                  <p className='text-red-500'>{ errors.trademart && errors.trademart.message}</p>
              </div>
              <select {...register("madein")}>
                  <option>trung quoc</option>
                  <option>viet nam</option>
                  <option>nhat ban</option>
              </select>
              <br/>
              <br/>
              <br/>
              <br/>

              <button type='submit' className='bg-green-400 text-white p-5'>Add Products</button>
          </form>
    </div>
  )
}

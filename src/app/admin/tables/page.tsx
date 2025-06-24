import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import prisma from '@/lib/prisma';
import { deleteProduct } from '@/actions/actions';

export default async function page() {

  const products = await prisma.products.findMany()

  return (
    <div className='p-24'>
          <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">id</th>
          <th scope="col">title</th>
          <th scope="col">Description</th>
          <th scope="col">price</th>
          <th scope="col">slug</th>
          <th scope="col">isSale</th>
          <th scope="col">isBestSelling</th>
          <th scope="col">category</th>
          <th scope="col">view</th>
          <th scope="col">prevPrice</th>
          <th scope="col">createdAT</th>
          <th scope="col">actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((products, index) => (
          <tr key={products.slug}>
            <th scope='row'>{index + 1}</th>
            <td>{products.id}</td>
            <td>{products.title}</td>
            <td>{products.Description}</td>
            <td>{products.price}</td>
            <td>{products.slug}</td>
            <td>{products.isSale? "true" : "false"}</td>
            <td>{products.isBestSelling? "true" : "false"}</td>
            <td>{products.category}</td>
            <td>{products.view}</td>
            <td>{products.prevPrice ?? "none"}</td>
            <td>{products.createAt?.toLocaleString?.() ?? products.createAt?.toString?.() ?? "N/A"}</td>
            <td>
              <form action={deleteProduct}>
                <input type="text" name='id' defaultValue={products.id ?? ''} hidden />
                <button type="submit" className="btn btn-danger">Delete</button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

import React from 'react'

import { Product, FooterBanner, HeroBanner } from '../components';
import { client } from '../lib/client';

const Home = ({ productsData, bannerData}) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>

      <div className="products-container">
        {productsData?.map((product) => product.name)}
      </div>

      <FooterBanner />
    </>
  )
}

export const getServerSideProps = async () => {
  const products = `*[_type == "product"]`;
  const productsData = await client.fetch(products);

  const bannerQuery = `*[_type == "banner"]`;
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: {
      productsData,
      bannerData
    }
  }
}

export default Home
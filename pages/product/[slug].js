import React, { useState, useEffect } from 'react'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineStar, AiFillStar } from 'react-icons/ai';
import { useRouter } from 'next/router';

import { urlFor, client } from '../../lib/client'
import Product from '../../components/Product';
import { useStateContext } from '../../context/StateContext';

const ProductDetails = ({ productsData, similarProductsData }) => {
  const { image, name, description, price, reviews } = productsData;
  const { addToCart, setShowCart } = useStateContext();

  const [index, setIndex] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(1);
  const dynamicRoute = useRouter().asPath;

  const increaseQuantities = () => {
    setTotalQuantities((prevQuantity) => prevQuantity + 1);
  }

  const decreaseQuantities = () => {
    setTotalQuantities((prevQuantity) => {
      if (prevQuantity - 1 < 1) return 1;
      return prevQuantity - 1
    });
  }
  
  useEffect(() => setTotalQuantities(1), [dynamicRoute]);

  const handleBuyNow = () => {
    addToCart(productsData, totalQuantities);
    setShowCart(true);
  }

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img src={urlFor(image && image[index])} alt={name} className="product-detail-image" />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img key={i} src={urlFor(item)} className={i === index ? 'small-image selected-image' : 'small-image' } onMouseEnter={() => setIndex(i)}/>              
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>
              ({reviews}) Reviews
            </p>
          </div>
          <h4>Product Details: </h4>
          <p>{description}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity: </h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQuantities}><AiOutlineMinus /></span>
              <span className="num">
                {1 && totalQuantities}
              </span>
              <span className="plus" onClick={increaseQuantities}><AiOutlinePlus /></span>
            </p>
          </div>
          <div className="buttons">
            <button type="button"className="add-to-cart" onClick={() => addToCart(productsData, totalQuantities)}>
              Add to Cart
            </button>
            <button type="button"className="buy-now" onClick={handleBuyNow}>
              Buy now!
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You might also be interested in</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {similarProductsData?.map((product) => <Product key={product._id} product={product} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const productsQuery = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;
  const productsData = await client.fetch(productsQuery);
  const paths = productsData.map((product) => ({ params: { slug: product.slug.current } }));

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps = async ({ params: { slug }}) => {
  const productsQuery = `*[_type == "product" && slug.current == "${slug}"][0]`;
  const productsData = await client.fetch(productsQuery);

  const similarProducts = `*[_type == "product"]`;
  const similarProductsData = await client.fetch(similarProducts);

  return {
    props: {
      productsData,
      similarProductsData
    }
  }
}

export default ProductDetails
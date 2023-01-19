import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Button, Container, Tooltip, Typography } from '@mui/material';
import { MdAddShoppingCart } from 'react-icons/md'
import axios from 'axios';
import { ContextFunction } from '../../Context/Context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Components/loading/Loading';


const ProductDetail = () => {
    const { cart, setCart } = useContext(ContextFunction)
    const [isLoading, setIsLoading] = useState(false)

    const { id } = useParams()
    const [product, setProduct] = useState([])
    const getProduct = async () => {
        setIsLoading(true)
        const response = await axios.get(`${process.env.REACT_APP_FETCH_PRODUCT}/${id}`)
        setProduct(response.data)
        setIsLoading(false)
    }
    useEffect(() => {
        getProduct()
    }, [])

    const addToCart = async (product) => {
        let authToken = localStorage.getItem('Authorization')
        // const { name, description, price, rating, image, _id } = product
        const response = await axios.post(`${process.env.REACT_APP_ADD_CART}`, product, {
            headers: {
                'Authorization': authToken
            }
        })
        setCart(response.data)
        toast.success("Added To Cart", { autoClose: 500, })
        setCart([...cart, product])
    }
    const loading = isLoading ?
        (
            <Container maxWidth='xl' style={{ marginTop: 10, display: "flex", flexWrap: "wrap", paddingLeft: 10, paddingBottom: 20 }}><Loading /></Container >
        )
        : ""
    return (
        <>
            {loading}
            <Container maxWidth='xl' sx={{ background: "", marginTop: 20 }}>
                <Typography variant='body1'>{product.name}</Typography>
                <Box className='img-box'  >
                    <img alt={product.name} src={product.image} className='img' />
                </Box>
                <Box>
                    <Tooltip title='Add To Cart'>
                        <Button variant='contained' startIcon={<MdAddShoppingCart />} onClick={() => addToCart(product)}>Buy</Button>
                    </Tooltip>
                </Box>
                <ToastContainer />
            </Container >
        </>
    )
}

export default ProductDetail
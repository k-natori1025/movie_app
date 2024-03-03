import AppLayout from '@/components/Layouts/AppLayout'
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Fab,
    Grid,
    Modal,
    Rating,
    TextareaAutosize,
    Tooltip,
    Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import laravelAxios from '@/lib/laravelAxios'
import AddIcon from '@mui/icons-material/Add'

const Detail = ({ detail, media_type, media_id }) => {
    const [open, setOpen] = useState(false) // モーダルウィンドウを表示するかどうかのstate
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }
    const handleReviewChange = e => {
        setReview(e.target.value)
        console.log(review)
    }
    const handleRatingChange = (e, newValue) => {
        setRating(newValue)
        console.log(rating)
    }
    //ratingが0ならfalseになるので!ratingでisDisabledにtrueが入る
    //reviewが空or空文字の場合はreviewはfalseなのでisDisabledにtrueが入る
    const isDisabled = !rating || !review.trim()
    const handleReviewAdd = async () => {
        try {
            const response = await laravelAxios.post(`api/reviews`, {
                content: review,
                rating: rating,
                media_type: media_type,
                media_id: media_id,
            })
        } catch (err) {
            console.log(err)
        }
    }
    // const [reviews, setReviews] = useState([])
    const reviews = [
        {
            id: 1,
            content: 'まあまあ面白かった',
            rating: 4,
            user: {
                name: 'Aさん',
            },
        },
        {
            id: 2,
            content: '普通でした',
            rating: 3,
            user: {
                name: 'Bさん',
            },
        },
        {
            id: 3,
            content: 'つまらなかった',
            rating: 2,
            user: {
                name: 'cさん',
            },
        },
    ]
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await laravelAxios.get(
                    `api/reviews/${media_type}/${media_id}`,
                )
                console.log(response.data)
                // setReviews(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchReviews()
    }, [media_type, media_id])
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail
                </h2>
            }>
            <Head>
                <title>Laravel - Detail</title>
            </Head>
            <Box
                sx={{
                    height: { xs: 'auto', md: '70vh' },
                    bgcolor: 'red',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                {/* 映画/TV番組情報表示 */}
                <Box
                    sx={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/original${detail.backdrop_path})`,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(10px)',
                        },
                    }}
                />
                {/* 映画/TV番組情報中身 */}
                <Container sx={{ zIndex: 1 }}>
                    <Grid container alignItems={'center'}>
                        <Grid
                            item
                            md={4}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                            <img
                                src={`https://image.tmdb.org/t/p/original${detail.poster_path}`}
                                width={'80%'}
                            />
                        </Grid>
                        <Grid item md={8} sx={{ color: 'white' }}>
                            <Typography variant="h4" paragraph>
                                {detail.title || detail.name}
                            </Typography>
                            <Typography paragraph>{detail.overview}</Typography>
                            <Typography variant="h6">
                                {media_type == 'movie'
                                    ? `公開日:${detail.release_date}`
                                    : `初回放送日:${detail.first_air_date}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            {/* レビュー内容表示 */}
            <Container sx={{ py: 4 }}>
                <Typography
                    component={'h1'}
                    variant="h4"
                    align="center"
                    gutterBottom>
                    レビュー一覧
                </Typography>
                <Grid container spacing={3}>
                    {reviews.map(review => (
                        <Grid item xs={12} key={review.id}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component={'div'}
                                        gutterBottom>
                                        {review.user.name}
                                    </Typography>

                                    <Rating value={review.rating} readOnly />

                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        paragraph>
                                        {review.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* レビュー追加ボタン */}
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 5,
                }}>
                <Tooltip title="レビュー追加">
                    <Fab
                        style={{ background: '#1976d2', color: 'white' }}
                        onClick={handleOpen}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Box>
            {/* レビュー追加モーダル */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                    <Typography variant="h6" component="h2">
                        レビューを書く
                    </Typography>
                    <Rating
                        required
                        onChange={handleRatingChange}
                        value={rating}
                    />
                    <TextareaAutosize
                        required
                        minRows={5}
                        placeholder="レビュー内容"
                        style={{ width: '100%', marginTop: '10px' }}
                        onChange={handleReviewChange}
                        value={review}
                    />
                    <Button variant="outlined" disabled={isDisabled} onClick={handleReviewAdd}>
                        送信
                    </Button>
                </Box>
            </Modal>
        </AppLayout>
    )
}

// SSR
export async function getServerSideProps(context) {
    const { media_type, media_id } = context.params

    try {
        const jpResponse = await axios.get(
            `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`,
        )

        const combinedData = { ...jpResponse.data }

        if (!jpResponse.data.overview) {
            const enResponse = await axios.get(
                `https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
            )
            combinedData.overview = enResponse.data.overview
        }

        return {
            props: {
                detail: combinedData,
                media_type,
                media_id,
            },
        }
    } catch {
        return { notFound: true }
    }
}

export default Detail

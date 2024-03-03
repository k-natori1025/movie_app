import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import Layout from '@/components/Layouts/Layout'
import Sidebar from '@/components/Sidebar'
import MediaCard from '@/components/MediaCard'
import { Grid, Typography } from '@mui/material'

const search = () => {
    const [category, setCategory] = useState('all')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true) //api呼び出しの状態管理
    const router = useRouter()
    const { query: searchQuery } = router.query
    console.log(searchQuery)
    console.log(category)
    useEffect(() => {
        // 初回レンダリング時にはsearchQuery(検索文字)は何も入っていないため、APIを叩かないようにする
        if (!searchQuery) {
            return
        }
        const fetchMedia = async () => {
            try {
                const response = await axios.get(
                    `api/searchMedia?searchQuery=${searchQuery}`,
                )
                console.log(response)
                const searchResults = response.data.results
                console.log(searchResults)
                const validResults = searchResults.filter(
                    item =>
                        item.media_type == 'movie' || item.media_type == 'tv',
                )
                console.log(validResults)
                setResults(validResults)
                console.log(results)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchMedia()
    }, [searchQuery])

    const filteredResults = results.filter(result => {
        if (category == 'all') {
            return true
        }
        return result.media_type === category
    })
    console.log(filteredResults)

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Search
                </h2>
            }>
            <Head>
                <title>Laravel - Home</title>
            </Head>
            <Layout sidebar={<Sidebar setCategory={setCategory} />}>
                {/* api呼び出し中は「検索中」と表示 */}
                {/* 検索結果が0なら、その旨を伝えるメッセージを表示 */}
                {loading ? (
                    <Grid item textAlign={'center'} xs={20}>
                        <Typography>検索中...</Typography>
                    </Grid>
                ) : filteredResults.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredResults.map(media => (
                            // eslint-disable-next-line react/jsx-key
                            <MediaCard item={media} key={media.id} />
                        ))}
                    </Grid>
                ) : (
                    <Grid item textAlign={'center'} xs={20}>
                        <Typography>検索結果が見つかりませんでした</Typography>
                    </Grid>
                )}
            </Layout>
        </AppLayout>
    )
}

export default search

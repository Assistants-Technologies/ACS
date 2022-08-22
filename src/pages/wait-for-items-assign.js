import React, {useEffect} from 'react'
import axios from 'axios'

export async function getServerSideProps(context) {
    return {
        props: {
            url: context.query.url.split('?')[0],
            session_id: context.query.session_id,
            redirect: context.query.redirect || '/shop',
        },
    }
}


const Page = (props) => {
    useEffect(()=>{
        setInterval(()=>{
            axios.get(`/api/stripe/webhook/assigned/${props.session_id}`).then(res=>{
                if(res.data?.error == false){
                    location.href = `${props.redirect}?finished_session_id=${props.session_id}`
                }else{
                    console.log(res.data?.message)
                }
            })
        }, 300)
    }, [])

    return <a>Processing... Please wait, you will be redirected automatically.</a>
}

export default Page
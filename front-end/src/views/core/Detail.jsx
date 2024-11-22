import React, { useEffect, useState, useRef } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";
import useUserData from "../../plugin/useUserData";

function Detail() {
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]);
    const user_id = useUserData()?.user_id;
    const [createComment, setCreateComment] = useState({
        comment: ''
    })

    const param = useParams();

    const fetchPost = async () => {
        const response = await apiInstance.get(`posts/${param.slug}`)
        setPost(response.data);

        const tagArray = response?.data?.tags?.split(',');
        setTags(tagArray);
    }

    const handleCreateCommentChange = (event) =>(
        setCreateComment({
            ...createComment,
            [event.target.name]: event.target.value,
        })
    )

    const handleCreateCommentSubmit = async (event) =>{
        event.preventDefault();
        
        const json = {
            'post_id': post?.id,
            'comment': createComment.comment,
            'user_id': user_id
        };

        const response = await apiInstance.post(`posts/comment/`, json);
        console.log(response)

        Toast('success', 'comment created successfully')
        fetchPost();
        setCreateComment({
            username: "",
            comment: "",
        });

    }

    const handleLikeComment = async (event) =>{
        event.preventDefault();
        const response = await apiInstance.post(`posts/like/`, {
            post_id: post?.id,
            user_id: user_id
        });

        console.log(response)

        Toast('success', response.data.message)
        fetchPost();
    }

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchPost();  // Only call once
        }
    }, []);
    return (
        <>
            <Header />
            <section className=" mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <a href="#" className="badge bg-danger mb-2 text-decoration-none">
                                <i className="small fw-bold " />
                                {post?.category}
                            </a>
                            <h1 className="text-center">{post?.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5" data-sticky="" data-margin-top={80} data-sticky-for={991}>
                                <div className="position-relative">
                                    <div className="avatar avatar-xl">
                                        <img className="avatar-img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} src={post?.author_image} alt="avatar" />
                                    </div>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                                        {post?.author_name}
                                    </a>
                                    <p>{post?.author_bio || ''}</p>
                                </div>

                                <hr className="d-none d-lg-block " />

                                <ul className="list-inline list-unstyled">
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-calendar"></i> {Moment(post.date)}
                                    </li>
                                    {/* <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-clock"></i> 5 min read
                                    </li> */}
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <a href="#" className="text-body">
                                            <i className="fas fa-heart me-1" />
                                        </a>
                                         {post?.likes?.length} Likes
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-eye" />
                                        {post.views} Views
                                    </li>
                                </ul>
                                {/* Tags */}
                                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-start">
                                    {tags?.map((tag) => (
                                        <li className="list-inline-item">
                                            <a className="text-body text-decoration-none fw-bold" href="#">
                                                #{tag}
                                            </a>
                                        </li>
                                    ))}
                                  
                                </ul>

                                <button className="btn btn-success" onClick={handleLikeComment}>
                                    <i className="fas fa-thumbs-up me-2"></i>{post?.likes?.length}
                                </button>
                                
                            </div>
                        </div>
                        {/* Left sidebar END */}
                        {/* Main Content START */}
                        <div className="col-lg-10 mb-5">
                            <p>
                                {post?.content}
                            </p>

                            <hr />

                            <div>
                                <h3>{post?.comments?.length} comments</h3>
                                {post?.comments?.map((c, index) => (
                                    <div className="my-4 d-flex bg-light p-3 mb-3 rounded">
                                        <img className="avatar avatar-md rounded-circle float-start me-3" src={c?.commenter_image} style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%" }} alt="avatar" />
                                        <div>
                                            <div className="mb-2">
                                                <h5 className="m-0">{c?.user?.username}</h5>
                                                <span className="me-3 small">{Moment(c.date)}</span>
                                            </div>
                                            <p className="fw-bold">{c?.comment}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Comments END */}
                            {/* Reply START */}
                            <div className="bg-light p-3 rounded">
                                <h3 className="fw-bold">Leave a reply</h3>
                                <small>Required fields are marked *</small>
                                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                                    <div className="col-12">
                                        <label className="form-label">Write Comment *</label>
                                        <textarea className="form-control" value={createComment.comment} rows={4} onChange={handleCreateCommentChange} name="comment" />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">
                                            Post comment <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Detail;

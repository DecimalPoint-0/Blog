import React, { useState, useEffect} from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import useUserData from "../../plugin/useUserData";
import Moment from "../../plugin/Moment";
import Toast from "../../plugin/Toast";


function Comments() {
    const [comments, setComments] = useState([]);
    const [reply, setReply] = useState({
        'reply': '',
        'comment_id': ''
    })
    const user_id = useUserData()?.user_id

    const fetchData = async () => {
        const response = await apiInstance.get(`author/dashboard/comments/${user_id}`);
        setComments(response?.data)

    }

    const handleChange = (event) =>{
        setReply({
            ...reply,
            [event.target.name]: event.target.value,
        })
    }

    const sendReply = async (e, commentId) =>{
        e.preventDefault();
       try {
            const response = await apiInstance.post(`author/dashboard/comment-reply/`, {
                comment_id: commentId,
                reply: reply.reply
            })
            console.log(response.data)
            fetchData()
            Toast('success', 'comment replied')
            setReply({
                'reply': "",
                'comment_id': ''
            })
       } catch (error) {
            console.log(error)
       }
    }



    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            <Header />
            <section className="pt-5 pb-5">
                <div className="container">
                    <div className="row mt-0 mt-md-4">
                        <div className="col-lg-12 col-md-8 col-12">
                            {/* Card */}
                            <div className="card mb-4">
                                {/* Card header */}
                                <div className="card-header d-lg-flex align-items-center justify-content-between">
                                    <div className="mb-3 mb-lg-0">
                                        <h3 className="mb-0">Comments</h3>
                                        <span>You have full control to manage your own comments.</span>
                                    </div>
                                </div>
                                {/* Card body */}
                                {comments.map((comment, index) => (
                                    <>
                                        <div className="card-body">
                                        
                                            {/* List group */}
                                            <ul className="list-group list-group-flush">
                                                {/* List group item */}
                                                <li className="list-group-item p-4 shadow rounded-3">
                                                    <div className="d-flex">
                                                        <img src={comment.commenter_image} alt="avatar" className="rounded-circle avatar-lg" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover" }} />
                                                        <div className="ms-3 mt-2">
                                                            <div className="d-flex align-items-center justify-content-between">
                                                                <div>
                                                                    <h4 className="mb-0">{comment?.user?.username}</h4>
                                                                    <span>{Moment(comment.date)}</span>
                                                                </div>
                                                                <div>
                                                                    <a href="#" data-bs-toggle="tooltip" data-placement="top" title="Report Abuse">
                                                                        <i className="fe fe-flag" />
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="mt-2">
                                                                    <span className="fw-bold me-2">
                                                                        Comment <i className="fas fa-arrow-right"></i>
                                                                    </span>
                                                                    {comment?.comment}
                                                                </p>
                                                                <p className="mt-2">
                                                                    <span className="fw-bold me-2">
                                                                        Response <i className="fas fa-arrow-right"></i>
                                                                    </span>
                                                                    {comment.reply === null ? '' : comment.reply}
                                                                </p>
                                                                <p>
                                                                    <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseExample${comment.id.toString()}`} aria-expanded="false" aria-controls={`collapseExample${comment.id.toString()}`}>
                                                                        Send Response
                                                                    </button>
                                                                </p>
                                                                <div class="collapse" id={`collapseExample${comment.id.toString()}`}>
                                                                    <div class="card card-body">
                                                                        <form onSubmit={(e) => sendReply(e, comment.id)}>
                                                                            <div class="mb-3">
                                                                                <label for="exampleInputEmail1" class="form-label">
                                                                                    Write Response
                                                                                </label>
                                                                                <textarea onChange={(e) => handleChange(e)} value={reply.reply} name="reply" id="" cols="30" className="form-control" rows="4"></textarea>
                                                                            </div>
                                                                            <button type="submit" class="btn btn-primary">
                                                                                Send Response <i className="fas fa-paper-plane"> </i>
                                                                            </button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                        </>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Comments;

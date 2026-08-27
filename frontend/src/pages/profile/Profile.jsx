import React from 'react';
import { Link } from 'react-router';
import profileImage from '@/assets/images/profile.jpg';
import coverImage from '@/assets/images/cover.jpg';
import verifiedIcon from '@/assets/images/icons/verified.svg';
import { AiOutlineEdit } from "react-icons/ai";
import { useSelector } from 'react-redux';
import constants from '../../utils/constants';

export default function Profile() {
    const { user } = useSelector((state) => state.auth);
    console.log(user, 'user');


    return (
        <>
            <div className='space-y-8'>
                <div className=" bg-white  rounded-md">
                    <div className="trezo-card-content">
                        <div className="relative rounded-t-md">
                            {user?.coverImage ? (
                                <img
                                    src={`${constants?.IMAGE_URL}${user?.coverImage}` || coverImage}
                                    alt="cover-image"
                                    className="rounded-t-md w-full h-[340px] object-cover"

                                />
                            ) : (
                                <img
                                    src={coverImage}
                                    alt="cover-image"
                                    className="rounded-t-md w-full h-[340px] object-cover"

                                />
                            )}


                        </div>

                        <div className="px-[20px] md:px-[30px] pb-[20px] md:pb-[45px] mt-[20px] md:-mt-[60px]">
                            <div className="md:flex items-end justify-between">
                                <div className="md:flex items-end">
                                    <div className="relative w-[160px]">
                                        <img
                                            src={`${constants?.IMAGE_URL}${user?.profileImage}` || profileImage}
                                            alt="profile-image"
                                            className="rounded-full   border-white dark:border-[#0c1427]"
                                            width={160}
                                            height={160}
                                        />
                                        <img
                                            src={verifiedIcon}
                                            alt="verified"
                                            className="absolute bottom-[11px] ltr:-right-[7px] rtl:-left-[7px]"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <div className="ltr:md:ml-[30px] rtl:md:mr-[30px] mt-[12px] md:mt-0">
                                        <span className="block text-lg md:text-[20px] lg:text-xl text-slate-700   font-bold capitalize">
                                            {user?.fullName || "—"}
                                        </span>
                                        <span className="block xl:text-md font-medium text-slate-400 mt-[2px] md:mt-0 capitalize">
                                            {user?.role?.replace(/_/g, " ") || "Member"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-[5px] md:mt-0">
                                    <Link
                                        to="/profile/edit"
                                        className="inline-flex items-center gap-2 rounded-md font-medium lg:text-md border border-gray-100 dark:border-[#172036] py-[11px] px-[27px] transition-all hover:border-primary-500"
                                    >
                                        <AiOutlineEdit size={20} />
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="   rounded-md grid  grid-cols-3">
                    <div className='bg-white p-4 rounded-md space-y-4'>
                        <h2 className="text-xl font-bold text-slate-700">Personal Information</h2>
                        <div className='space-y-2'>
                            <p className="text-sm text-slate-500 ">Full Name : <span className='font-semibold'>{user?.fullName}</span></p>
                            <p className="text-sm text-slate-500 ">Email : <span className='font-semibold'>{user?.email}</span></p>
                            <p className="text-sm text-slate-500 capitalize">Role : <span className='font-semibold'>{user?.role?.replace(/_/g, " ")}</span></p>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

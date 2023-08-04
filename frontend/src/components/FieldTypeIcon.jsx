import React from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import { BiSolidLockAlt } from 'react-icons/bi'
import { BsTextIndentLeft } from 'react-icons/bs'
import { CiTextAlignLeft } from 'react-icons/ci'
import { GoNumber } from 'react-icons/go'
import { HiOutlineMailOpen } from 'react-icons/hi'
import { ImListNumbered, ImTextColor } from 'react-icons/im'
import { LuCheckSquare, LuFileJson } from 'react-icons/lu'
import { MdDateRange, MdFormatColorFill } from 'react-icons/md'
import { TbCalendarTime } from 'react-icons/tb'


const FieldTypeIcon = ({type}) => (
    <>
        {
            type == 'Text' ?
                <ImTextColor />
                :
                type == 'Long Text' ?
                    <CiTextAlignLeft />
                    :
                    type == 'Rich Text' ?
                        <BsTextIndentLeft />
                        :
                        type == 'Link/Slug' ?
                            <AiOutlineLink />
                            :
                            type == 'Email' ?
                                <HiOutlineMailOpen />
                                :
                                type == 'Password' ?
                                    <BiSolidLockAlt />
                                    :
                                    type == 'Number' ?
                                        <GoNumber />
                                        :
                                        type == 'Enumeration' ?
                                            <ImListNumbered />
                                            :
                                            type == 'Boolean' ?
                                                <LuCheckSquare />
                                                :
                                                type == 'Color' ?
                                                    <MdFormatColorFill />
                                                    :
                                                    type == 'Date' ?
                                                        <MdDateRange />
                                                        :
                                                        type == 'Time' ?
                                                            <TbCalendarTime />
                                                            :
                                                            type == 'JSON' ?
                                                                < LuFileJson />
                                                                :
                                                                ''
        }
    </>
)


export default FieldTypeIcon
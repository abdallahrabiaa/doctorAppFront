import React from 'react'
import { MoreIcon, SearchIcon } from '../icons'
import onchange from 'utils/onchange'
import {
    Input
} from '@windmill/react-ui'
export default function SearchInput({ query, setQuery }) {
    return (
        <div className="flex justify-end mb-4 flex-1  ml-auto">
            <div className="relative p-4 max-w-xl  focus-within:text-indigo-500 ">
                <div className="absolute inset-y-0 flex items-center ml-2 ">
                    <SearchIcon className="w-4 h-4" aria-hidden="true" />
                </div>
                <Input style={{ "max-width": "230px" }}
                    className="pl-8 text-gray-700"
                    placeholder="Search... "
                    value={query}
                    onChange={(e) => onchange(e, setQuery)}
                    aria-label="Search"
                />
            </div>
        </div>
    )
}

import React from 'react'
import { NavTravel } from '../../components/NavTravel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const travel = () => {
  return (
    <div>
        <NavTravel />
        <div className="xl:mx-auto mb-14 xl:max-w-7xl xl:px-10 mt-8">
            <div className='max-w-4xl mx-auto'>
                <div className=''>
                    <h1 className='text-center mb-10 font-bold text-3xl'>BOOK FLIGHT</h1>
                </div>
                <div className='flex space-x-5 w-full items-center'>
                    <div className="flex-1">
                        <Label>First Name</Label>
                        <Input className="w-full" />
                    </div>
                    <div className="flex-1">
                        <Label>Last Name</Label>
                        <Input className="w-full" />
                    </div>
                </div>
                <div className='mt-5 flex flex-col space-y-5'>
                    <div>
                        <Label>Email Address</Label>
                        <Input />
                    </div>

                    <div>
                        <Label>Flying From</Label>
                        <Input />
                    </div>

                    <div>
                        <Label>Flying To</Label>
                        <Input />
                    </div>

                    <div>
                        <Label>Select Trip</Label>
                        <Select>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select Trip" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Round Trip</SelectItem>
                                <SelectItem value="dark">One-Way Trip</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>How many Adults</Label>
                        <Input />
                    </div>

                    <div>
                        <Label>How many Children (Optional)</Label>
                        <Input />
                    </div>

                    <div>
                        <Label>Preferred Airline</Label>
                        <Input />
                    </div>

                    <div>
                        <Label>Additional Information</Label>
                        <Textarea placeholder="Type your message here." />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default travel

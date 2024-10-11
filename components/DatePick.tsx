"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex justify-between">
        {/* Start Date Input */}
        <div className="">
            <div>
                <p className="text-sm font-bold">Check-in</p>
            </div>
            <Popover>
            <PopoverTrigger asChild>
                <Button
                id="start-date"
                variant={"outline"}
                className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !date?.from && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? format(date.from, "LLL dd, y") : <span>Start date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                />
            </PopoverContent>
            </Popover>

        </div>

        {/* End Date Input */}
        <div>
            <div>
                <p className="text-sm font-bold">Check-out</p>
            </div>
            <Popover>
            <PopoverTrigger asChild>
                <Button
                id="end-date"
                variant={"outline"}
                className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !date?.to && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.to ? format(date.to, "LLL dd, y") : <span>End date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                />
            </PopoverContent>
            </Popover>

        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { getAllQueryParams, getQueryParam, setAllQueryParams } from "@/helper/queryParams";
import { useModal } from "../modal/modal-context";

export default function KanbanFilter() {
    const router = useRouter();

    const { openModal, closeModal } = useModal();

    const [name, setName] = useState<string>(() => (typeof window !== 'undefined' ? (getQueryParam('name') ?? '') : ''));
    const debounceRef = useRef<number | null>(null);

    const isDateActive = typeof window !== 'undefined' && (getQueryParam('startDate') || getQueryParam('endDate'));
    const isValueActive = typeof window !== 'undefined' && (getQueryParam('startValue') || getQueryParam('endValue'));

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(() => {
            const params = getAllQueryParams();
            if (name && name.trim() !== '') params.name = name.trim();
            else delete params.name;

            setAllQueryParams(params, { replace: true, router });
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [name]);

    function handleNameFilter(value?: string) {
        setName(value ?? '');
    }

    function handleDateRangeFilter(startDate?: string, endDate?: string) {
        const params = getAllQueryParams();

        if (startDate) params.startDate = startDate;
        else delete params.startDate;

        if (endDate) params.endDate = endDate;
        else delete params.endDate;

        setAllQueryParams(params, { replace: true, router });
        closeModal();
    }

    function handleValueRangeFilter(startValue?: string, endValue?: string) {
        const params = getAllQueryParams();

        if (startValue) params.startValue = startValue;
        else delete params.startValue;

        if (endValue) params.endValue = endValue;
        else delete params.endValue;

        setAllQueryParams(params, { replace: true, router });
        closeModal();
    }

    function handleFilterReset() {
        setAllQueryParams({}, { replace: true, router });
        setName('');
    }

    return (
        <>
            <div className="w-full h-25.5 inline-block clear-both box-content"></div>
            <div className="absolute z-10 top-18 w-full flex flex-col gap-3 bg-[#1A242E] px-4 pb-4">
                <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#617589]">Search</span>
                    <input value={name} onChange={(e) => handleNameFilter(e.target.value)} className="pl-10 py-2 rounded-xl w-full bg-[#2D3A4A] outline-none font-thin" type="text" placeholder="Search Client Name..." />
                </div>
                <div className="flex gap-4">
                    <button onClick={() => openModal({ Component: KanbanDateRangeFilter, componentProps: { onAction: handleDateRangeFilter, onClose: closeModal } })} className={`flex gap-2 items-center px-3 py-1 ${isDateActive ? 'bg-[#137FEC]' : 'bg-[#2D3A4A]'} rounded-2xl border border-[#193653] hover:bg-[#3A4A5C] cursor-pointer`}>
                        <span className="material-symbols-outlined text-[18px]!">Calendar_Today</span>
                        <span className="text-white font-light text-xs">Date Range</span>
                    </button>
                    <button onClick={() => openModal({ Component: KanbanValueRangeFilter, componentProps: { onAction: handleValueRangeFilter, onClose: closeModal } })} className={`flex gap-2 items-center px-3 py-1 rounded-2xl ${isValueActive ? 'bg-[#137FEC]' : 'bg-[#2D3A4A]'}  border border-[#193653] hover:bg-[#3A4A5C] cursor-pointer`}>
                        <span className="material-symbols-outlined text-[18px]!">Payments</span>
                        <span className="text-white font-light text-xs">Value Range</span>
                    </button>
                    <button onClick={handleFilterReset} className="flex gap-2 items-center px-3 py-1 bg-[#2D3A4A] rounded-2xl border border-[#193653] hover:bg-[#3A4A5C] cursor-pointer">
                        <span className="material-symbols-outlined text-[18px]!">filter_list</span>
                        <span className="text-white font-light text-xs">Reset</span>
                    </button>
                </div>
            </div>
        </>
    )
}

type kanbanDateRangeFilterProps = {
    onAction: (startDate?: string | null, endDate?: string | null) => void;
    onClose: () => void;
};

function KanbanDateRangeFilter({ onAction, onClose }: kanbanDateRangeFilterProps) {
    const [startDate, setStartDate] = useState<string | null>(() => (typeof window !== 'undefined' ? (getQueryParam('startDate') ?? null) : null));
    const [endDate, setEndDate] = useState<string | null>(() => (typeof window !== 'undefined' ? (getQueryParam('endDate') ?? null) : null));

    return (
        <div className="flex flex-col gap-2 bg-[#1A242E] rounded-lg">
            <div>
                <h2 className="text-lg font-bold text-white">Select Date Range</h2>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-white font-light">Start Date</label>
                <input value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value)} type="date" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                <label className="text-white font-light">End Date</label>
                <input value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value)} type="date" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
                <button onClick={onClose} className="px-3 py-1 bg-[#2D3A4A] rounded-xl border border-[#193653] text-white font-light cursor-pointer hover:bg-[#3A4A5C]">Cancel</button>
                <button onClick={() => { onAction(startDate, endDate); onClose(); }} className="px-3 py-1 bg-[#137FEC] rounded-xl border border-[#137FEC] text-white font-light cursor-pointer hover:bg-[#137FEC]">Apply</button>
            </div>
        </div>
    )
}

type kanbanValueRangeFilterProps = {
    onAction: (startValue?: string | null, endValue?: string | null) => void;
    onClose: () => void;
};

function KanbanValueRangeFilter({ onAction, onClose }: kanbanValueRangeFilterProps) {
    const [startValue, setStartValue] = useState<string | null>(() => (typeof window !== 'undefined' ? (getQueryParam('startValue') ?? null) : null));
    const [endValue, setEndValue] = useState<string | null>(() => (typeof window !== 'undefined' ? (getQueryParam('endValue') ?? null) : null));

    return (
        <div className="flex flex-col gap-2 bg-[#1A242E] rounded-lg">
            <div>
                <h2 className="text-lg font-bold text-white">Select Value Range</h2>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-white font-light">Start Value</label>
                <input value={startValue ?? ''} onChange={(e) => setStartValue(e.target.value)} type="number" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
                <label className="text-white font-light">End Value</label>
                <input value={endValue ?? ''} onChange={(e) => setEndValue(e.target.value)} type="number" className="px-3 py-2 rounded-xl bg-[#2D3A4A] outline-none font-thin w-full text-white" />
            </div>
            <div className="flex justify-end gap-2 mt-2">
                <button onClick={onClose} className="px-3 py-1 bg-[#2D3A4A] rounded-xl border border-[#193653] text-white font-light cursor-pointer hover:bg-[#3A4A5C]">Cancel</button>
                <button onClick={() => { onAction(startValue, endValue); onClose(); }} className="px-3 py-1 bg-[#137FEC] rounded-xl border border-[#137FEC] text-white font-light cursor-pointer hover:bg-[#137FEC]">Apply</button>
            </div>
        </div>
    )
}
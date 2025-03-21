import Link from 'next/link'
import React from 'react'

const QuickLinks = () => {
    const QuickLinksData = [
        {
            id: 1,
            title: "Important Documents",
            desc: "There are many variations of passages of Lorem Ipsum available....",
            redirectTitle: "Go to Documents"
        },
        {
            id: 2,
            title: "Notice Board",
            desc: "There are many variations of passages of Lorem Ipsum available....",
            redirectTitle: "Go to Notice Section"
        },
        {
            id: 3,
            title: "Tender Process",
            desc: "There are many variations of passages of Lorem Ipsum available....",
            redirectTitle: "Tender Process Info"
        }
    ]
    
    return (
        <div className='w-full bg-[#F1E3C7] py-12 md:py-16 lg:py-24 flex flex-col items-center justify-center'>
            <div className='w-full max-w-6xl px-4 flex flex-col items-start gap-5'>
                <div className="flex items-center gap-1 text-[#B57E10]">
                    <hr className="w-12 border-t-2 border-[#B57E10] rounded-full" />
                    <h1>Important</h1>
                </div>
                <h1 className='text-3xl md:text-4xl font-bold'>Quick Links</h1>
                
                {/* Cards Wrapper */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-6 mt-4'>
                    {QuickLinksData.map((link) => (
                        <div 
                            key={link.id} 
                            className='h-auto bg-white rounded-lg flex flex-col items-start justify-between p-5 shadow-md transition-transform hover:shadow-lg hover:-translate-y-1'
                        >
                            <div className='flex flex-col items-start gap-3 mb-6'>
                                <h1 className='text-xl font-bold'>{link.title}</h1>
                                <p className='text-sm opacity-50 font-medium'>{link.desc}</p>
                            </div>
                            <div className='w-full flex items-center justify-center'>
                                <Link 
                                    href={"#"} 
                                    className='p-3 bg-[#B57E10] text-white font-semibold rounded-sm text-sm text-center w-full md:w-56 hover:bg-[#9e6c0d] transition-colors'
                                >
                                    {link.redirectTitle}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuickLinks;
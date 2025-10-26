"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Save, X, MessageSquare, Plus, Trash2 } from "lucide-react"
import AdminLayout from "@/components/layouts/AdminLayout"
import { useRouter } from "next/navigation" // ✅ add this for navigation
import TabsNav from "@/components/admin/TabsNav"

interface QuestionOption {
    id: number
    value: string
}

interface Question {
    id: number
    question: string
    type: "text" | "textarea" | "radio" | "checkbox"
    answer: string
    options: QuestionOption[]
    isRequired: boolean
}

interface QuestionsContentProps {
    eventId: string | null
}

export default function QuestionsContentClient({ eventId: _eventId }: QuestionsContentProps) {
    const _router = useRouter()

    const [questions, setQuestions] = useState<Question[]>([
        {
            id: 1,
            question: "What should I bring to the event?",
            type: "textarea",
            answer: "",
            options: [],
            isRequired: false,
        },
        {
            id: 2,
            question: "Is there parking available?",
            type: "radio",
            answer: "",
            options: [
                { id: 1, value: "Yes" },
                { id: 2, value: "No" },
            ],
            isRequired: true,
        },
        {
            id: 3,
            question: "Can I get a refund if I can't attend?",
            type: "radio",
            answer: "",
            options: [
                { id: 1, value: "Yes" },
                { id: 2, value: "No" },
                { id: 3, value: "Maybe" },
            ],
            isRequired: true,
        },
    ])

    const questionTypes = [
        { value: "text", label: "Short Text" },
        { value: "textarea", label: "Long Text" },
        { value: "radio", label: "Single Choice" },
        { value: "checkbox", label: "Multiple Choice" },
    ]

    const handleQuestionChange = (id: number, field: string, value: any) => {
        setQuestions(
            questions.map((q) => {
                if (q.id === id) {
                    if (field === "type") {
                        const newType = value as string
                        const shouldResetOptions = !["radio", "checkbox"].includes(newType)
                        return {
                            ...q,
                            type: newType as any,
                            options: shouldResetOptions ? [] : q.options,
                            answer: "",
                        }
                    }
                    return { ...q, [field]: value }
                }
                return q
            })
        )
    }

    const _handleAnswerChange = (id: number, answer: string) => {
        setQuestions(questions.map((q) => (q.id === id ? { ...q, answer } : q)))
    }

    const addNewQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                question: "",
                type: "text",
                answer: "",
                options: [],
                isRequired: false,
            },
        ])
    }

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter((q) => q.id !== id))
    }

    // Option management
    const addOption = (questionId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? { ...q, options: [...q.options, { id: Date.now(), value: "" }] }
                    : q
            )
        )
    }

    const updateOption = (questionId: number, optionId: number, value: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt) => (opt.id === optionId ? { ...opt, value } : opt)),
                    }
                    : q
            )
        )
    }

    const removeOption = (questionId: number, optionId: number) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.filter((opt) => opt.id !== optionId),
                    }
                    : q
            )
        )
    }

    const handleSaveQuestions = () => {
        console.log("Saving questions:", questions)
        alert("Questions saved successfully!")
    }

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

                <TabsNav />

                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <MessageSquare size={20} className="mr-2" />
                                Event Questions & Forms
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Create custom questions and forms for your event attendees.
                                    Choose the question type and configure options as needed.
                                </p>

                                {/* Render Questions */}
                                {questions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800"
                                    >
                                        {/* Question Header */}
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 space-y-4">
                                                {/* Question Text */}
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                        Question Text
                                                    </label>
                                                    <Input
                                                        value={question.question}
                                                        onChange={(e) =>
                                                            handleQuestionChange(question.id, "question", e.target.value)
                                                        }
                                                        placeholder="Enter your question..."
                                                        className="w-full"
                                                    />
                                                </div>

                                                {/* Question Type + Required */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                            Question Type
                                                        </label>
                                                        <Select
                                                            value={question.type}
                                                            onValueChange={(value) =>
                                                                handleQuestionChange(question.id, "type", value)
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select question type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {questionTypes.map((type) => (
                                                                    <SelectItem key={type.value} value={type.value}>
                                                                        {type.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="flex items-center space-x-2 pt-6">
                                                        <input
                                                            type="checkbox"
                                                            id={`required-${question.id}`}
                                                            checked={question.isRequired}
                                                            onChange={(e) =>
                                                                handleQuestionChange(question.id, "isRequired", e.target.checked)
                                                            }
                                                            className="text-[#019c9d] focus:ring-[#019c9d] rounded"
                                                        />
                                                        <label htmlFor={`required-${question.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Required field
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Options */}
                                                {["radio", "checkbox"].includes(question.type) && (
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
                                                        <div className="space-y-2">
                                                            {question.options.map((option) => (
                                                                <div key={option.id} className="flex items-center space-x-2">
                                                                    <Input
                                                                        value={option.value}
                                                                        onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                                                        placeholder="Enter option text..."
                                                                        className="flex-1"
                                                                    />
                                                                    <Button type="button" variant="outline" size="sm" onClick={() => removeOption(question.id, option.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                            <Button type="button" variant="outline" size="sm" onClick={() => addOption(question.id)} className="text-[#019c9d] hover:text-[#017879] hover:bg-[#019c9d]/10">
                                                                <Plus size={16} className="mr-1" />
                                                                Add Option
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remove Question Button */}
                                            <Button type="button" variant="outline" size="sm" onClick={() => removeQuestion(question.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Question Button */}
                                <Button type="button" onClick={addNewQuestion} variant="outline" className="w-full border-dashed border-gray-300 dark:border-gray-600 py-6 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <Plus size={20} className="mr-2" />
                                    Add New Question
                                </Button>

                                {/* Footer Buttons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Button type="button" variant="outline">
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </Button>
                                    <Button type="button" className="bg-[#019c9d] hover:bg-[#017879]" onClick={handleSaveQuestions}>
                                        <Save size={16} className="mr-2" />
                                        Save Questions
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}

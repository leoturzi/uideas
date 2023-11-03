'use client';

import { SessionInterface } from '@/common.types';
import Image from 'next/image';
import FormField from './FormField';
import CustomMenu from './CustomMenu';
import { categoryFilters } from '@/constants';
import { useState } from 'react';
import Button from './Button';
import { createNewProject, fetchToken } from '@/lib/actions';
import { useRouter } from 'next/navigation';

type Props = {
    type: string;
    session: SessionInterface;
};

function ProjectForm({ type, session }: Props) {
    const router = useRouter();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        const { token } = await fetchToken();

        try {
            if (type === 'create') {
                await createNewProject(form, session?.user?.id, token);
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.includes('image')) {
            return alert('Please upload an image file');
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;

            handleStateChange('image', result);
        };
    };

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prev) => ({ ...prev, [fieldName]: value }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        image: '',
        title: '',
        description: '',
        liveSiteUrl: '',
        githubUrl: '',
        category: '',
    });

    console.log(form);
    return (
        <form onSubmit={handleFormSubmit} className="flexStart form">
            <div className="flexStart form_image-container">
                <label htmlFor="poster" className="flexCenter form_image-label">
                    {!form.image && 'Choose an image for your project'}
                </label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    required={type === 'create'}
                    className="form_image-input"
                    onChange={handleChangeImage}
                />
                {form?.image && (
                    <Image
                        src={form.image}
                        alt="project image"
                        className="sm:-19 object-contain z-20"
                        fill
                    />
                )}
            </div>
            <FormField
                title="Title"
                type="text"
                state={form.title}
                placeholder="Flexible"
                setState={(value) => handleStateChange('title', value)}
            />
            <FormField
                title="Description"
                type="text"
                state={form.description}
                placeholder="Flexible"
                setState={(value) => handleStateChange('description', value)}
            />
            <FormField
                title="Website URL"
                type="url"
                state={form.liveSiteUrl}
                placeholder="Flexible"
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />
            <FormField
                title="GitHub URL"
                type="url"
                state={form.githubUrl}
                placeholder="Github URL"
                setState={(value) => handleStateChange('githubUrl', value)}
            />
            <CustomMenu
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />
            <div className="flexStart w-full">
                <Button
                    title={
                        isSubmitting
                            ? `${type === 'create' ? 'Creating' : 'Editing'}`
                            : `${type === 'create' ? 'Create' : 'Edit'}`
                    }
                    type="submit"
                    leftIcon={isSubmitting ? '' : '/plus.svg'}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    );
}

export default ProjectForm;

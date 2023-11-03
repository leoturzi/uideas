import { Menu } from '@headlessui/react';
import Image from 'next/image';

type Props = {
    title: string;
    state: string;
    filters: Array<string>;
    setState: (value: string) => void;
};

function CustomMenu({ title, state, filters, setState }: Props) {
    return (
        <div className="flexStart flex-col w-full gap-7 relative">
            <label htmlFor="" className="w-full text-gray-100">
                {title}
            </label>
            <Menu as="div" className="self-start relative">
                <div>
                    <Menu.Button className="flexCenter custom_menu-btn">
                        {state || 'Select a category'}
                        <Image
                            src="/arrow-down.svg"
                            width={10}
                            height={5}
                            alt="arrow down"
                        />
                    </Menu.Button>
                </div>
                <Menu.Items className="flexStart custom_menu-items">
                    {filters.map((tag) => (
                        <Menu.Item key={tag}>
                            {({ active }) => (
                                <button
                                    type="button"
                                    className="custom_menu-item"
                                    value={tag}
                                    onClick={(e) =>
                                        setState(e.currentTarget.value)
                                    }
                                >
                                    {tag}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Menu>
        </div>
    );
}

export default CustomMenu;

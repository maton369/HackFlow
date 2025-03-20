import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        team_name: '',
        team_image_url: '',
        team_image: null,
        members: [],
    });

    const { props } = usePage();
    const router = props.router;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 🔍 ユーザー検索
    const searchUsers = async (query) => {
        setSearchTerm(query);
        if (query.length > 2) {
            const response = await axios.get(route('users.search', { query }));
            setSearchResults(response.data.users);
        } else {
            setSearchResults([]);
        }
    };

    // ✅ メンバー追加
    const addMember = (user) => {
        if (!selectedMembers.find((member) => member.id === user.id) && user.id !== auth.user.id) {
            setSelectedMembers([...selectedMembers, user]);
            setData('members', [...data.members, user.id]);
        }
    };

    // ❌ メンバー削除
    const removeMember = (userId) => {
        const updatedMembers = selectedMembers.filter(member => member.id !== userId);
        setSelectedMembers(updatedMembers);
        setData('members', updatedMembers.map(user => user.id));
    };

    // 🔥 画像選択時の処理
    const handleFileChange = (e) => {
        setData('team_image', e.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        formData.append('team_name', data.team_name);

        if (data.team_image) {
            formData.append('team_image', data.team_image);
        }

        data.members.forEach(member => formData.append('members[]', member));

        try {
            await axios.post(route('teams.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            alert('✅ チームが作成されました！');

            window.location.href = route('mypage');
        } catch (error) {
            console.error("❌ 作成エラー:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">チーム作成</h2>}
        >
            <Head title="チーム作成" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {/* ✅ ローディングスピナー */}
                        {isLoading && (
                            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-600"></div>
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div>
                                <InputLabel htmlFor="team_name" value="チーム名" />
                                <TextInput
                                    id="team_name"
                                    value={data.team_name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('team_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.team_name} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="team_image" value="チーム画像" />
                                <input
                                    id="team_image"
                                    type="file"
                                    name="team_image"
                                    accept="image/*"
                                    className="mt-1 block w-full"
                                    onChange={handleFileChange}
                                />
                                <InputError message={errors.team_image} className="mt-2" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="team_image_url" value="チーム画像URL (任意)" />
                                <TextInput
                                    id="team_image_url"
                                    value={data.team_image_url}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('team_image_url', e.target.value)}
                                />
                                <InputError message={errors.team_image_url} className="mt-2" />
                            </div>

                            {/* 🔍 ユーザー検索 */}
                            <div className="mt-4">
                                <InputLabel htmlFor="member_search" value="メンバーを検索" />
                                <TextInput
                                    id="member_search"
                                    value={searchTerm}
                                    className="mt-1 block w-full"
                                    onChange={(e) => searchUsers(e.target.value)}
                                    placeholder="名前で検索..."
                                />
                                {searchResults.length > 0 && (
                                    <ul className="bg-white shadow mt-2 max-h-40 overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <li
                                                key={user.id}
                                                className="p-2 cursor-pointer hover:bg-gray-200"
                                                onClick={() => addMember(user)}
                                            >
                                                {user.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* 👥 選択されたメンバー */}
                            <div className="mt-4">
                                <h4 className="font-semibold">選択されたメンバー</h4>
                                {selectedMembers.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {selectedMembers.map((user) => (
                                            <li key={user.id} className="flex justify-between items-center">
                                                {user.name}
                                                <button
                                                    type="button"
                                                    className="text-red-500 ml-2"
                                                    onClick={() => removeMember(user.id)}
                                                >
                                                    ❌
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">メンバーなし</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton disabled={isLoading || processing}>
                                    {isLoading ? "作成中..." : "チーム作成"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

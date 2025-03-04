import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function Edit({ auth, team }) {
    const { data, setData, patch, processing, errors } = useForm({
        team_name: team.team_name,
        team_image_url: team.team_image_url || '',
        // ✅ 常にリーダーを含む
        members: [
            auth.user.id,
            ...team.members
                .filter(member => member.user?.id !== auth.user.id)
                .map(member => member.user.id),
        ],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([
        { user_id: auth.user.id, name: auth.user.name, role: 'owner' }, // ✅ リーダーを先に追加
        ...team.members
            .filter(member => member.user?.id !== auth.user.id)
            .map(member => ({
                user_id: member.user.id,
                name: member.user.name,
            })),
    ]);

    useEffect(() => {
        setSelectedMembers([
            { user_id: auth.user.id, name: auth.user.name, role: 'owner' }, // ✅ リーダーを再設定
            ...team.members
                .filter(member => member.user?.id !== auth.user.id)
                .map(member => ({
                    user_id: member.user.id,
                    name: member.user.name,
                })),
        ]);
    }, [team]);

    // 🔍 ユーザー検索
    const searchUsers = async (query) => {
        setSearchTerm(query);
        if (query.length > 2) {
            try {
                const response = await axios.get(route('users.search', { query }));
                setSearchResults(response.data.users);
            } catch (error) {
                console.error("❌ ユーザー検索エラー:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    // ✅ メンバー追加（リーダーは追加できない）
    const addMember = (user) => {
        if (!selectedMembers.find(member => member.user_id === user.id) && user.id !== auth.user.id) {
            setSelectedMembers([...selectedMembers, { user_id: user.id, name: user.name }]);
            setData('members', [...data.members, user.id]);
        }
    };

    // ❌ メンバー削除（リーダーは削除できない）
    const removeMember = (userId) => {
        if (userId === auth.user.id) {
            alert("⚠️ リーダーは削除できません。");
            return;
        }

        const updatedMembers = selectedMembers.filter(member => member.user_id !== userId);
        setSelectedMembers(updatedMembers);
        setData('members', [auth.user.id, ...updatedMembers.map(user => user.user_id)]); // ✅ リーダーを再追加
    };

    const submit = (e) => {
        e.preventDefault();
        setData('members', [auth.user.id, ...selectedMembers.map(member => member.user_id)]); // ✅ リーダーを最終確認で追加
        patch(route('teams.update', team.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">チーム編集</h2>}
        >
            <Head title="チーム編集" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
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

                            {/* 👥 選択されたメンバー（リーダーを含む） */}
                            <div className="mt-4">
                                <h4 className="font-semibold">選択されたメンバー</h4>
                                {selectedMembers.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {selectedMembers.map((user) => (
                                            <li key={user.user_id} className="flex justify-between items-center">
                                                {user.name} {user.user_id === auth.user.id ? "(リーダー)" : ""}
                                                {user.user_id !== auth.user.id && (
                                                    <button
                                                        type="button"
                                                        className="text-red-500 ml-2"
                                                        onClick={() => removeMember(user.user_id)}
                                                    >
                                                        ❌
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">メンバーなし</p>
                                )}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <PrimaryButton disabled={processing}>チーム更新</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

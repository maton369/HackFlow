import Dropdown from '@/Components/Dropdown';
import { useForm } from '@inertiajs/react';

export default function UserDropdown({ user }) {
    const { delete: destroy, processing, setData, data } = useForm({ password: '' });

    const handleDeleteAccount = () => {
        if (confirm("本当にアカウントを削除しますか？ この操作は元に戻せません。")) {
            destroy(route('profile.destroy'), {
                data,
                preserveScroll: true,
                onSuccess: () => alert("アカウントが削除されました。"),
                onError: (errors) => alert(errors.password || "エラーが発生しました。"),
            });
        }
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <span className="inline-flex rounded-md">
                    <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                    >
                        {user.name}
                        <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </span>
            </Dropdown.Trigger>

            <Dropdown.Content>
                <Dropdown.Link href={route('mypage')}>マイページ</Dropdown.Link>
                <Dropdown.Link href={route('profile.edit')}>プロフィール編集</Dropdown.Link>
                <Dropdown.Link href={route('logout')} method="post" as="button">ログアウト</Dropdown.Link>

                <hr className="my-2" />
                {/* ✅ アカウント削除ボタン */}
                <div className="px-4 py-2">
                    <label className="block text-sm font-medium text-gray-700">パスワードを入力して削除</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm w-full mt-2"
                        placeholder="パスワード"
                    />
                    <button
                        onClick={handleDeleteAccount}
                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                        disabled={processing}
                    >
                        アカウント削除
                    </button>
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
}

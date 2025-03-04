import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { delete: destroy, processing, setData, data } = useForm({
        password: ''
    });


    // ✅ アカウント削除処理
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
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        {/* ✅ ユーザー名からマイページに遷移できるように修正 */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {/* ✅ ここを修正: マイページに遷移するリンクを追加 */}
                                        <Dropdown.Link href={route('mypage')}>マイページ</Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')}>プロフィール編集</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            ログアウト
                                        </Dropdown.Link>

                                        <hr className="my-2" />
                                        {/* ✅ アカウント削除ボタン */}
                                        <div className="px-4 py-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                パスワードを入力して削除
                                            </label>
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
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            {/* ✅ スマホ用のナビゲーションにもマイページを追加 */}
                            <ResponsiveNavLink href={route('mypage')}>マイページ</ResponsiveNavLink>
                            <ResponsiveNavLink href={route('profile.edit')}>プロフィール編集</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                ログアウト
                            </ResponsiveNavLink>
                            {/* ✅ アカウント削除ボタンをスマホメニューにも追加 */}
                            <div className="px-4 py-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    パスワードを入力して削除
                                </label>
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
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}

import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css"; // スタイルを追加

function App() {
	const [winningUuid, _] = useState<string>(uuidv4());
	const [gotUuids, setGotUuids] = useState<string[]>([]); // UUIDの保存
	const [currentIndex, setCurrentIndex] = useState<number>(-1); // 現在表示するUUIDのインデックス
	const [isAnimating, setIsAnimating] = useState<boolean>(false); // アニメーション中かどうか
	const [showScrollTopButton, setShowScrollTopButton] =
		useState<boolean>(false); // トップに戻るボタンの表示
	const resultEndRef = useRef<HTMLDivElement | null>(null); // 結果の終わりを参照するRef

	// 指定された回数分のUUIDを生成する関数
	const generateUuids = (n: number) => {
		const newUuids = Array.from({ length: n }, () => uuidv4());
		setGotUuids(newUuids);
		setCurrentIndex(0);
		setIsAnimating(true);
	};

	// アニメーションで1枚ずつ表示するロジック
	useEffect(() => {
		if (isAnimating && currentIndex < gotUuids.length - 1) {
			const timer = setTimeout(() => {
				setCurrentIndex((prev) => prev + 1);
			}, 200);
			return () => clearTimeout(timer);
		}
		if (currentIndex === gotUuids.length - 1) {
			setIsAnimating(false);
		}
	}, [isAnimating, currentIndex, gotUuids.length]);

	// 結果が表示されるたびにスクロール
	useEffect(() => {
		if (resultEndRef.current) {
			resultEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [currentIndex]); // currentIndexが更新されるたびにスクロール

	// スクロール監視
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 300) {
				setShowScrollTopButton(true);
			} else {
				setShowScrollTopButton(false);
			}
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// トップに戻る関数
	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const compareUuids = (winningUuid: string, uuid: string) => {
		return [...uuid].map((c, i) => (
			<span
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				key={i}
				className={c === winningUuid[i] && c !== "-" ? "matched" : ""}
			>
				{c}
			</span>
		));
	};

	// くじ引きのボタン
	const drawButton = (n: number) => (
		<button
			className="generate-button"
			type="button"
			onClick={() => {
				generateUuids(n);
			}}
			disabled={isAnimating}
		>
			{n}回 くじを引く！
		</button>
	);

	return (
		<div className="lottery-container">
			<h1>🎉UUID宝くじ🥳</h1>

			<div className="winning-uuid-box">
				<h2>今日の当たりUUID</h2>
				<p className="winning-uuid">{winningUuid}</p>
			</div>

			{drawButton(1)}
			{drawButton(10)}
			{drawButton(100)}

			<div className="results-container">
				<h2>結果</h2>
				{gotUuids.slice(0, currentIndex + 1).map((uuid, index) => (
					<div key={uuid} className="uuid-box">
						<div className="uuid-row">
							<span className="uuid-index">No.{index + 1}</span>
							<span className="uuid">{compareUuids(winningUuid, uuid)}</span>
						</div>
					</div>
				))}
				{/* 結果の終わりをマークするためのdiv */}
				<div ref={resultEndRef} />
			</div>
			{/* トップに戻るボタン */}
			{showScrollTopButton && (
				<button className="scroll-top-button" onClick={scrollToTop}>
					⬆️
				</button>
			)}
		</div>
	);
}

export default App;

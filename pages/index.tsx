import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container m-auto">
        <h1 className="text-9xl text-center m-auto">Home</h1>
      </div>
    </>
  );
}

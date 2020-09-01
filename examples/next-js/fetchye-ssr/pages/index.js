import { Layout } from "../components/Layout";
import SimpleCache from "fetchye/lib/cache/SimpleCache";
import { useFetchye, makeServerFetchye } from "fetchye";

const cache = SimpleCache();

export default function IndexPage({ initialPerson }) {
  const { isLoading, data } = useFetchye(
    "https://bulyq.sse.codesandbox.io/profile",
    {
      initialData: initialPerson
    }
  );
  return (
    <Layout>Hello World, {!isLoading && data?.ok && data?.body?.name}</Layout>
  );
}

const fetchye = makeServerFetchye({
  cache,
  fetchClient: fetch
});

export async function getServerSideProps() {
  try {
    const res = await fetchye("https://bulyq.sse.codesandbox.io/profile");
    return {
      props: {
        initialPerson: res
      }
    };
  } catch (error) {
    console.error(error.message);
    return {};
  }
}

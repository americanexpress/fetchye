import { Layout } from "../components/Layout";
import { useFetchye, makeServerFetchye, SimpleCache } from "fetchye";

const cache = SimpleCache();

// Codesandbox takes a second to get Next.JS started...
export default function IndexPage({ initialPerson }) {
  const { isLoading, data } = useFetchye(
    "https://bulyq.sse.codesandbox.io/profile",
    {
      initialData: initialPerson
    }
  );
  return (
    <Layout>
      <p>
        {isLoading && (
          <span aria-label="loading" role="img">
            ⏳
          </span>
        )}
        {!isLoading && data?.body.name}
      </p>
   </Layout>
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

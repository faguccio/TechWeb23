<script setup>
import { ref, computed } from "vue";
import Humb from "../general/Humb.vue";
//prova

const navItems = [
  {
    title: "Home",
    destination: "/",
  },
  {
    title: "New Post",
    destination: "/newpost",
  },
  {
    title: "Account",
    destination: "/account",
  },
];

const scrollTop = () => {
  window.scrollTo(0, 0);
};

const isNavExpanded = ref(false);
const navLayout = computed(() => {
  return `${
    isNavExpanded.value ? "grid" : "hidden"
  } md:flex md:mx-5 pb-4 md:pb-0`;
});

const toggleMenu = () => {
  isNavExpanded.value = !isNavExpanded.value;
};
</script>

<template>
  <div
    class="bg-primary flex flex-col md:flex-row md:justify-between px-2 md:py-2 sticky z-10 top-0 bg-base-100 items-center"
  >
    <div class="flex justify-between items-center w-full">
      <div class="-ml-2 md:ml-0">
        <router-link to="/">
          <img
            class="scale-50 md:scale-75 w-24"
            src="https://seeklogo.com/images/V/vulture-logo-AF847BCA43-seeklogo.com.png"
            alt="website logo"
            @click="scrollTop"
          />
        </router-link>
      </div>

      <button
        class="btn btn-square btn-ghost scale-125 md:hidden"
        @click="toggleMenu"
      >
        <Humb />
      </button>
    </div>

    <div :class="navLayout">
      <a
        v-for="item in navItems"
        :key="item.destination"
        :id="item.destination"
        class="mx-4"
      >
        <router-link :to="item.destination">
          <button class="btn glass">
            {{ item.title }}
          </button>
        </router-link>
      </a>
    </div>
  </div>
</template>

<!-- <div className="flex justify-between items-center">
          

          <div className="flex items-center">
            <div className="md:hidden">
              {localStorage.getItem("userID") !== null ? (
                <Link to="/account">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-0">
                      <img src={avatarPath} />
                    </div>
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="btn btn-sm btn-outline">Sign in</button>
                </Link>
              )}
            </div>

            <button
              className="btn btn-square btn-ghost scale-125 mr-8 ml-4 md:hidden"
              onClick={handleClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 scale-125 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div> -->

<!-- function NavBar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [avatarPath, setAvatarPath] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );

  function handleClick() {
    setIsNavExpanded(!isNavExpanded);
  }

  if (localStorage.getItem("userID") !== null) {
    const userID = localStorage.getItem("userID").toString();
    console.log(userID);

    const fetchUser = async () => {
      const res = await fetch(`${Const.apiurl}/user/${userID}`);

      return await res.json();
    };

    const { data: user } = useQuery(["user", userID], fetchUser);

    useEffect(() => {
      if (user) {
        if (user.propic_path !== "") {
          setAvatarPath(user.propic_path);
        }
      }
    }, [user]);
  }

} -->

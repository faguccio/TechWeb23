<script setup>
import { ref } from "vue";

const navItems = [
  {
    title: "Home",
    destination: "/",
  },
  {
    title: "Account",
    destination: "/account",
  },
];

// const defaultMenuClasses = 'w-full md:block md:w-auto'

const changeColorNav = (id) => {
  const dict = navbarItems.map((item) => ({ name: item.destination }));

  document.addEventListener("click", function () {
    dict.forEach((element) => {
      document.getElementById(element.name).style.backgroundColor = "white";
    });
  });
};

// let menuOpen = false
// let menuClasses = ref<string>('hidden ' + defaultMenuClasses)
// let isLogged = ref<boolean>(Helpers.isLogged())
// const toggleMenu = () => {
//   menuOpen = !menuOpen
//   if (menuOpen) menuClasses.value = defaultMenuClasses
//   else menuClasses.value = 'hidden ' + defaultMenuClasses
// }

// const login = () => {
//   router.redirect('/login')
// }

// const logout = () => {
//   // TODO maybe an alert
//   Helpers.doLogout()
//   window.location.reload()
//   router.redirect('/')
// }

// const root = import.meta.env.BASE_URL
</script>

<template>
  <div
    class="bg-primary md:flex md:justify-between px-2 md:py-2 sticky z-10 top-0 bg-base-100 items-center"
  >
    <ul class="flex">
      <li
        v-for="item in navItems"
        :key="item.destination"
        :id="item.destination"
        v-on:click="changeColorNav(item.destination)"
        class="mx-4"
      >
        <router-link :to="item.destination">
          <button href="#" class="btn">
            {{ item.title }}
          </button>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<!-- <div className="flex justify-between items-center">
          <div className="-ml-2 md:ml-0">
            <Link to="/">
              <img
                className="scale-50 md:scale-75"
                src="https://seeklogo.com/images/V/vulture-logo-AF847BCA43-seeklogo.com.png"
                width="75px"
                alt="website logo"
                onClick={() => window.scrollTo(0, 0)}
              />
            </Link>
          </div>

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

<!-- className={
            isNavExpanded ? "grid md:flex md:mx-5" : "hidden md:flex md:mx-5"
          } -->

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
      const res = await fetch(`http://localhost:3000/user/${userID}`);

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

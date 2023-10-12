/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

// mui imports
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Prayer from "./Prayer";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Stack } from "@mui/material";

// React
import { useEffect } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { fetchPrayers } from "../features/feachApiSlice";
import {
  dispatchTimer,
  dispatchToday,
  dispatchSelectedCity,
  dispatchNextPrayerIndex,
} from "../features/countDownSlice";

// Libraries
import moment from "moment";
import "moment/dist/locale/ar-dz";
moment.locale("ar");

export default function MainComponent() {
  //Redux
  const dispatch = useDispatch();
  const prayersData = useSelector((state) => state.prayersApi.prayers);
  const timer = useSelector((state) => state.countDown.timer);
  const today = useSelector((state) => state.countDown.today);
  const selectedCity = useSelector((state) => state.countDown.selectedCity);
  const nextPrayerIndex = useSelector(
    (state) => state.countDown.nextPrayerIndex
  );

  // vars
  const avilableCitys = [
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
  ];
  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  const handleChange = (event) => {
    const currentCity = avilableCitys.find((city) => {
      return city.apiName == event.target.value;
    });
    dispatch(dispatchSelectedCity(currentCity));
  };

  // create api request based on city
  useEffect(() => {
    dispatch(fetchPrayers(selectedCity.apiName));
  }, [selectedCity]);

  // satrt countdown timer
  useEffect(() => {
    const t = moment();
    dispatch(dispatchToday(t.format("MMM Do YYYY | h:mm")));
    let interval = setInterval(() => {
      setupCountDownInterval();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [prayersData]);

  function setupCountDownInterval() {
    // find what next prayer is
    let currentPrayeIndex = 0;
    const momentNow = moment();
    if (
      momentNow.isAfter(moment(prayersData.Fajr, "hh:mm")) &&
      momentNow.isBefore(moment(prayersData.Dhuhr, "hh:mm"))
    ) {
      currentPrayeIndex = 1;
    } else if (
      momentNow.isAfter(moment(prayersData.Dhuhr, "hh:mm")) &&
      momentNow.isBefore(moment(prayersData.Asr, "hh:mm"))
    ) {
      currentPrayeIndex = 2;
    } else if (
      momentNow.isAfter(moment(prayersData.Asr, "hh:mm")) &&
      momentNow.isBefore(moment(prayersData.Maghrib, "hh:mm"))
    ) {
      currentPrayeIndex = 3;
    } else if (
      momentNow.isAfter(moment(prayersData.Maghrib, "hh:mm")) &&
      momentNow.isBefore(moment(prayersData.Isha, "hh:mm"))
    ) {
      currentPrayeIndex = 4;
    } else {
      currentPrayeIndex = 0;
    }
    dispatch(dispatchNextPrayerIndex(currentPrayeIndex));

    // Countdown timer
    const nextPrayerTimeObject = moment(
      prayersData[prayersArray[nextPrayerIndex].key],
      "hh:mm"
    );
    let timeDiff = nextPrayerTimeObject.diff(momentNow);
    if (timeDiff < 0) {
      const midNight = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const timeFromMidnightToFajr = nextPrayerTimeObject.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalTime = midNight + timeFromMidnightToFajr;
      timeDiff = totalTime;
    }
    const durationRemainingTime = moment.duration(timeDiff);

    const hours =
      +durationRemainingTime.hours() < 10
        ? `0${durationRemainingTime.hours()}`
        : durationRemainingTime.hours();
    const minutes =
      +durationRemainingTime.minutes() < 10
        ? `0${durationRemainingTime.minutes()}`
        : durationRemainingTime.minutes();
    const seconds =
      +durationRemainingTime.seconds() < 10
        ? `0${durationRemainingTime.seconds()}`
        : durationRemainingTime.seconds();
    dispatch(dispatchTimer(`${seconds} : ${minutes} : ${hours} `));
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        direction: "rtl",
        minHeight: "96vh",
      }}
    >
      <Container maxWidth="md" style={{ width: "100%" }}>
        <Grid container spacing={2}>
          <Grid xs={6}>
            <h5>{today}</h5>
            <h2>{selectedCity.displayName}</h2>
          </Grid>
          <Grid xs={6}>
            <h5>متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName} </h5>
            <h2>{timer}</h2>
          </Grid>
        </Grid>
        <Divider
          style={{
            borderColor: "white",
            opacity: "0.2",
          }}
        />
        <Stack
          direction={"row"}
          style={{ marginTop: "10px", justifyContent: "center" }}
        >
          <FormControl style={{ width: "30%" }}>
            <InputLabel id="demo-simple-select-label">
              <span style={{ color: "white" }}>المدينة</span>
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              onChange={handleChange}
            >
              {avilableCitys.map((city) => {
                return (
                  <MenuItem value={city.apiName} key={city.apiName}>
                    {city.displayName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        <Grid container spacing={1} style={{ marginTop: "30px" }}>
          <Grid xs={12} md={6} sm={6} lg={2.4}>
            <Prayer
              name={"الفجر"}
              time={prayersData.Fajr}
              image={
                "https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
              }
            />
          </Grid>
          <Grid xs={12} md={6} sm={6} lg={2.4}>
            <Prayer
              name={"الظهر"}
              time={prayersData.Dhuhr}
              image={
                "https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
              }
            />
          </Grid>
          <Grid xs={12} md={6} sm={6} lg={2.4}>
            <Prayer
              name={"العصر"}
              time={prayersData.Asr}
              image={
                "https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
              }
            />
          </Grid>
          <Grid xs={12} md={6} sm={6} lg={2.4}>
            <Prayer
              name={"المغرب"}
              time={prayersData.Maghrib}
              image={
                "https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
              }
            />
          </Grid>
          <Grid xs={12} md={6} sm={6} lg={2.4}>
            <Prayer
              name={"العشاء"}
              time={prayersData.Isha}
              image={
                "https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
              }
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

// Todos :-
// 1- Remove states to redux **done
// 2- Delete currentPreayerIndex variable  **done
// 3- Create loader to times **done
// 4- find a solution to reload issue

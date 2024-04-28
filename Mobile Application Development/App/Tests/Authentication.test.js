import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import * as SecureStore from "expo-secure-store";

import WelcomeScreen from "../screens/WelcomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

jest.mock("expo-secure-store", () => ({
  __esModule: true,
  deleteItemAsync: jest.fn().mockResolvedValue(),
  getItemAsync: jest.fn().mockResolvedValue(JSON.stringify({})),
}));

// Tests for Welcome Screen

describe("WelcomeScreen", () => {
  it("should render without crashing", () => {
    render(<WelcomeScreen navigation={{ navigate: jest.fn() }} />);
  });

  it("should navigate to Login screen when login button is pressed", () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);
    const loginButton = getByText("Login");
    fireEvent.press(loginButton);
    expect(navigation.navigate).toHaveBeenCalledWith("Login");
  });

  it("should navigate to Register screen when register button is pressed", () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<WelcomeScreen navigation={navigation} />);
    const registerButton = getByText("Register");
    fireEvent.press(registerButton);
    expect(navigation.navigate).toHaveBeenCalledWith("Register");
  });
});

// Tests for Register Screen

describe("RegisterScreen", () => {
  it("should render without crashing", () => {
    render(<RegisterScreen />);
  });

  it("should handle form submission correctly", () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);
    const nameInput = getByPlaceholderText("Full Name");
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const registerButton = getByText("REGISTER");

    fireEvent.changeText(nameInput, "John Doe");
    fireEvent.changeText(emailInput, "johndoe@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(registerButton);
  });
});

// Tests for Login Screen

describe("LoginScreen", () => {
  it("should render without crashing", () => {
    render(<LoginScreen />);
  });

  it("should handle form submission correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("LOGIN");

    fireEvent.changeText(emailInput, "johndoe@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);
  });
});

// Test for Home Screen

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should render without crashing", () => {
    render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
  });

  it("should display user information correctly", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@example.com",
    };

    SecureStore.getItemAsync.mockResolvedValue(JSON.stringify(user));

    const { findByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    const fullName = await findByText("John Doe");
    const email = await findByText("johndoe@example.com");

    expect(fullName).toBeTruthy();
    expect(email).toBeTruthy();
  });

  it("should log out the user when logout button is pressed", async () => {
    const mockDeleteItemAsync = jest.spyOn(SecureStore, "deleteItemAsync");

    const { getByText } = render(<HomeScreen navigation={{ navigate: jest.fn() }} />);
    fireEvent.press(getByText("LOGOUT"));

    await waitFor(() => {
      expect(mockDeleteItemAsync).toHaveBeenCalledWith("current_user");
    });
  });
});
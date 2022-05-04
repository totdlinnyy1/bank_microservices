// The function returns true if there is enough money on the balance to withdraw and false if there is not enough

interface Data {
    walletBalance: number
    withdrawMoney: number
}

export const isMoneyEnoughToWithdraw = ({
    walletBalance,
    withdrawMoney,
}: Data): boolean => walletBalance - withdrawMoney >= 0
